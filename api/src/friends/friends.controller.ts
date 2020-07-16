import { Controller, Get, Param, Post, UseGuards, Req } from "@nestjs/common"
import { FriendsService } from "./friends.service"
import Friend from "./friend.entity"
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard"
import RequestWithUser from "../authentication/requestWithUser.interface"

@Controller("friends")
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  @UseGuards(JwtAuthenticationGuard)
  getUserFriends(@Req() request: RequestWithUser): Promise<Friend[]> {
    return this.friendsService.getUserFriends(Number(request.user.id))
  }

  @Post(":friendId")
  @UseGuards(JwtAuthenticationGuard)
  addUserFriend(
    @Param("friendId") friendId: string,
    @Req() request: RequestWithUser,
  ): Promise<Friend> {
    const userId = request.user.id

    return this.friendsService.addUserFriend(
      Number(userId),
      Number(friendId),
    )
  }
}
