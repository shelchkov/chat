import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { UsersService } from "./users.service"
import User from "./user.entity"
import JwtAuthenticationguard from "../authentication/jwt-authentication.guard"

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthenticationguard)
  searchUsers(@Query("q") query: string): Promise<User[]> {
    return this.usersService.searchUsers(query)
  }
}
