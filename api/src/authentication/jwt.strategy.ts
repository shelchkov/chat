import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy, ExtractJwt } from "passport-jwt"
import { ConfigService } from "@nestjs/config"
import { UsersService } from "../users/users.service"
import { Request } from "express"
import User from "../users/user.entity"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          request && request.cookies && request.cookies.Authentication,
      ]),
      secretOrKey: configService.get("JWT_SECRET"),
    })
  }

  async validate(payload: TokenPayload): Promise<User> {
    return this.userService.getById(payload.userId)
  }
}
