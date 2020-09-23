import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { UsersService } from "../users/users.service"
import { SignUpDto } from "./dto/signUp.dto"
import * as bcrypt from "bcrypt"
import PostgresErrorCode from "../database/postgresErrorCode.enum"
import User from "../users/user.entity"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { removePassword } from "../utils/utils"

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async signUp(data: SignUpDto): Promise<User | never> {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    try {
      const newUser = await this.usersService.create({
        ...data,
        email: data.email.toLowerCase(),
        password: hashedPassword,
      })

      return { ...newUser, password: undefined }
    } catch (error) {
      if (error && error.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          "User already exists",
          HttpStatus.BAD_REQUEST,
        )
      }

      throw new HttpException(
        "Something went wrong",
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  public async getAuthenticatedUser(
    email: string,
    password: string,
  ): Promise<User> {
    try {
      const user = await this.usersService.getByEmail(email)
      const isPasswordMatching = await bcrypt.compare(
        password,
        user.password,
      )

      if (!isPasswordMatching) {
        throw new HttpException("Wrong credentials", HttpStatus.BAD_REQUEST)
      }

      return removePassword(user)
    } catch {
      throw new HttpException("Wrong credentials", HttpStatus.BAD_REQUEST)
    }
  }

  public getCookieWithJwtToken(userId: number): string {
    const payload: TokenPayload = { userId }
    const token = this.jwtService.sign(payload)

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      "JWT_EXPIRATION_TIME",
    )}`
  }

  public getCookieForLogOut(): string {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`
  }

  public getUserIdFromToken(token: string): number {
    const { userId } = this.jwtService.decode(token) as TokenPayload

    return userId
  }
}
