import { Controller, Post, Body, Get } from "@nestjs/common"
import { SignUpDto } from "./dto/signUp.dto"
import { AuthenticationService } from "./authentication.service"
import { SignInDto } from "./dto/signIn.dto"
import User from "../users/user.entity"

@Controller("authentication")
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}
  @Post("sign-up")
  async signUp(@Body() data: SignUpDto): Promise<User> {
    return this.authenticationService.signUp(data)
  }

  @Get("sign-in")
  async signIn(@Body() data: SignInDto): Promise<User> {
    return this.authenticationService.getAuthenticatedUser(
      data.email,
      data.password,
    )
  }
}
