import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  Post,
  Param,
  HttpStatus,
  HttpException,
} from "@nestjs/common"
import { UsersService } from "./users.service"
import User from "./user.entity"
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard"
import RequestWithUser from "../authentication/requestWithUser.interface"

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  searchUsers(
    @Query("q") query: string,
    @Req() request: RequestWithUser,
  ): Promise<User[]> {
    return this.usersService.searchUsers(query, request.user.id)
  }

  @Post("/friends/:friendId")
  @UseGuards(JwtAuthenticationGuard)
  async addUsersFriend(
    @Param("friendId") friendId: string,
    @Req() request: RequestWithUser,
  ): Promise<User> {
    const userId = request.user.id

    if (userId === Number(friendId)) {
      throw new HttpException(
        "Can't add yourself as a friend",
        HttpStatus.BAD_REQUEST,
      )
    }

    try {
      await this.usersService.getById(Number(friendId))
    } catch {
      throw new HttpException("Friend doesn't exist", HttpStatus.NOT_FOUND)
    }

    return this.usersService.addFriend(userId, Number(friendId))
  }
}
