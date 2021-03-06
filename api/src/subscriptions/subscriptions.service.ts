import { Injectable } from "@nestjs/common"
import { Socket } from "socket.io"

import { getCookieParams } from "../utils/utils"
import { AuthenticationService } from "../authentication/authentication.service"
import User from "../users/user.entity"
import Message from "../messages/message.entity"

import { SubscriptionUserDto } from "./dto/subscriptionUser.dto"
import { OnlineUserDto } from "./dto/onlineUser.dto"

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}

  private users: SubscriptionUserDto[] = []

  authenticateUser(request: Request): number | undefined {
    const cookie = request.headers["cookie"]
    const token = getCookieParams(cookie)["Authentication"]
    const userId = this.authenticationService.getUserIdFromToken(token)

    return userId
  }

  sendErrorAndDisconnect(client: Socket, error?: string): void {
    client.send(JSON.stringify({ error: error || "Something went wrong" }))
    client.disconnect()
  }

  sendUsersStatus(): void {
    this.users.forEach((user): void => {
      const onlineUsers = this.users
        .filter((onlineUser): boolean =>
          user.friends.includes(onlineUser.userId),
        )
        .map((user): OnlineUserDto => ({ userId: user.userId }))

      if (onlineUsers.length > 0) {
        user.client.send(JSON.stringify({ online: onlineUsers }))
      }
    })
  }

  sendNewMessage = (
    client: Socket,
    newMessage: Message,
    fromName: string,
  ): void => {
    client.send(JSON.stringify({ newMessage, fromName }))
  }

  sendNewUserOnline = (client: Socket, newUserOnline: number): void => {
    client.send(JSON.stringify({ newUserOnline }))
  }

  // Users list
  addNewUser = (client: Socket, user: User): void => {
    const userId = user.id
    const friends = user.friends.map(friend => friend.id)
    this.users.push({ userId, client, friends })
  }

  deleteUserByClient = (client: Socket): void => {
    const index = this.users.findIndex(user => user.client === client)

    if (index) {
      this.users.splice(index, 1)
    }
  }

  findUserById = (id: number): SubscriptionUserDto =>
    this.users.find(user => user.userId === id)

  addUserFriend = (userId: number, friendId: number): boolean => {
    if (userId === friendId) {
      return false
    }

    const user = this.findUserById(userId)

    if (user && !user.friends.includes(friendId)) {
      user.friends.push(friendId)

      return true
    }

    return false
  }
}
