import { Controller, Post, Body, HttpCode, UseGuards } from "@nestjs/common"
import { SignUpDto } from "./dto/signUp.dto"
import { AuthenticationService } from "./authentication.service"
import { SignInDto } from "./dto/signIn.dto"
import User from "../users/user.entity"
import { LocalAuthenticationGuard } from "./localAuthentication.guard"
import RequestWithUser from "./requestWithUser.interface"

@Controller("authentication")
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}
  @Post("sign-up")
  async signUp(@Body() data: SignUpDto): Promise<User> {
    return this.authenticationService.signUp(data)
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post("sign-in")
  async signIn(@Body() data: RequestWithUser): Promise<User> {
    const user = data.user

    return { ...user, password: undefined }
  }
}
