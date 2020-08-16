import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Req,
  Res,
  Get,
} from "@nestjs/common"
import { SignUpDto } from "./dto/signUp.dto"
import { AuthenticationService } from "./authentication.service"
import User from "../users/user.entity"
import { LocalAuthenticationGuard } from "./localAuthentication.guard"
import RequestWithUser from "./requestWithUser.interface"
import { Response } from "express"
import JwtAuthenticationGuard from "./jwt-authentication.guard"

@Controller("authentication")
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}
  @Post("sign-up")
  async signUp(
    @Body() data: SignUpDto,
    @Res() response: Response,
  ): Promise<void> {
    const user = await this.authenticationService.signUp(data)

    const cookie = this.authenticationService.getCookieWithJwtToken(user.id)
    response.setHeader("Set-Cookie", cookie)

    response.send(user)
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post("sign-in")
  async signIn(
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ): Promise<void> {
    const user = request.user
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id)
    response.setHeader("Set-Cookie", cookie)

    user.friends = user.friends.map((friend): User & {
      password?: string
    } => ({ ...friend, password: undefined }))

    response.send(user)
  }

  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Post("sign-out")
  async signOut(@Res() response: Response): Promise<void> {
    response.setHeader(
      "Set-Cookie",
      this.authenticationService.getCookieForLogOut(),
    )

    response.send({ success: true })
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request: RequestWithUser): User {
    const user = request.user
    user.friends = user.friends.map((friend): User & {
      password?: string
    } => ({ ...friend, password: undefined }))

    return { ...user, password: undefined }
  }
}
