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

  authenticateUser = (request: Request): number | undefined => {
    const cookie = request.headers["cookie"]
    const token = getCookieParams(cookie)["Authentication"]
    return this.authenticationService.getUserIdFromToken(token)
  }

  sendErrorAndDisconnect = (client: Socket, error?: string): void => {
    client.send(JSON.stringify({ error: error || "Something went wrong" }))
    client.disconnect()
  }

  sendUsersStatus = (): void => {
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
    client.send(
      JSON.stringify({ newMessage, fromName, stopTyping: fromName }),
    )
  }

  sendNewUserOnline = (client: Socket, newUserOnline: number): void => {
    client.send(JSON.stringify({ newUserOnline }))
  }

  // Users list
  addNewUser = (client: Socket, user: User): void => {
    const friends = user.friends.map((friend) => friend.id)
    this.users.push({ userId: user.id, client, friends })
  }

  findUserById = (id: number): SubscriptionUserDto =>
    this.users.find((user) => user.userId === id)

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

  findUserByClient = (client: Socket): SubscriptionUserDto | undefined => {
    return this.users.find((user) => user.client === client)
  }

  handleTyping = (
    client: Socket,
    receiverId: number,
    stopTyping?: boolean,
  ) => {
    const user = this.findUserByClient(client)

    if (!user || !user.friends.includes(receiverId)) {
      return
    }

    const receiver = this.findUserById(receiverId)

    if (!receiver) {
      return
    }

    receiver.client.send(
      JSON.stringify({
        [stopTyping ? "stopTyping" : "startTyping"]: user.userId,
      }),
    )
  }

  
  private deleteUserByClient = (client: Socket): void => {
    const index = this.users.findIndex((user) => user.client === client)

    if (index !== -1) {
      this.users.splice(index, 1)
    }
  }

  private getOnlineFriends = (userId: number) => {
    const user = this.users.find((user) => user.userId === userId)

    if (!user) {
      return []
    }

    return user.friends.filter((friendId) =>
      this.users.find(({ userId }) => userId === friendId),
    )
  }

  private notifyDisconnection = (user: SubscriptionUserDto) => {
    user.friends.forEach((friendId) => {
      const online = this.getOnlineFriends(friendId).filter(
        (id) => id !== user.userId,
      )
      user.client.send(JSON.stringify({ online }))
    })
  }

  handleDisconnect = (client: Socket) => {
    const user = this.findUserByClient(client)

    if (!user) {
      return
    }

    this.notifyDisconnection(user)
    this.deleteUserByClient(client)
  }
}
