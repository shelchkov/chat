import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { UsersService } from "../users/users.service"
import { SignUpDto } from "./dto/signUp.dto"
import * as bcrypt from "bcrypt"
import PostgresErrorCode from "../database/postgresErrorCode.enum"
import User from "../users/user.entity"

@Injectable()
export class AuthenticationService {
  constructor(private readonly usersService: UsersService) {}

  public async signUp(data: SignUpDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10)

    try {
      const newUser = await this.usersService.create({
        ...data,
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

      return { ...user, password: undefined }
    } catch {
      throw new HttpException("Wrong credentials", HttpStatus.BAD_REQUEST)
    }
  }
}
