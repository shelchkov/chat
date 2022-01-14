import { Injectable } from "@nestjs/common"
import { Socket } from "socket.io"

import { getCookieParams } from "../utils/utils"
import { AuthenticationService } from "../authentication/authentication.service"
import User from "../users/user.entity"
import Message from "../messages/message.entity"

import { SubscriptionUserDto } from "./dto/subscriptionUser.dto"
import { UsersService } from "../users/users.service"

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  private users: Record<string, SubscriptionUserDto> = {}

  private authenticateUser = (request: Request): number | undefined => {
    const cookie = request.headers["cookie"]
    const token = getCookieParams(cookie)["Authentication"]

    return this.authenticationService.getUserIdFromToken(token)
  }

  sendErrorAndDisconnect = (client: Socket, error?: string): void => {
    client.send(JSON.stringify({ error: error || "Something went wrong" }))
    client.disconnect()
  }

  private addNewUser = (client: Socket, user: User): void => {
    const friends = user.friends.map((friend) => friend.id)
    this.users[user.id] = { client, friends }
  }

  private notifyConection = (userId: number) => {
    const user = this.users[userId]

    if (!user) {
      return
    }

    const onlineFriends = user.friends
      .map((id) => [id, this.users[id]] as const)
      .filter(([,user]) => !!user)

    onlineFriends.forEach(([,friend]) => {
      this.sendNewUserOnline(friend.client, userId)
    })

    onlineFriends.length &&
      user.client.send(
        JSON.stringify({
          online: onlineFriends.map(([userId]) => ({ userId })),
        }),
      )
  }

  handleConnection = async (
    client: Socket,
    request: Request,
  ): Promise<void> => {
    const userId = this.authenticateUser(request)

    if (!userId) {
      return this.sendErrorAndDisconnect(client, "No token")
    }

    const user = await this.usersService.getById(userId)

    if (!user) {
      return this.sendErrorAndDisconnect(client, "Invalid token")
    }

    this.addNewUser(client, user)
    this.notifyConection(userId)
  }

  private findUserIdByClient = (client: Socket): string | undefined => {
    const user = this.findUserByClient(client)

    return user ? user[0] : undefined
  }

  private deleteUserByClient = (client: Socket): void => {
    const id = this.findUserIdByClient(client)

    if (id !== undefined) {
      delete this.users[id]
    }
  }

  private getOnlineFriends = (user: SubscriptionUserDto) => user.friends.filter((friendId) => this.users[friendId])

  private notifyDisconnection = (user: SubscriptionUserDto, userId: number) => {
    user.friends.forEach((friendId) => {
      const friend = this.users[friendId]

      if (!friend) {
        return
      }

      friend.client.send(
        JSON.stringify({ online: this.getOnlineFriends(friend).filter((id) => id !== userId).map((userId) => ({ userId })) }),
      )
    })
  }

  handleDisconnect = (client: Socket) => {
    const [userId, user] = this.findUserByClient(client)

    if (!user) {
      return
    }

    this.notifyDisconnection(user, parseInt(userId))
    this.deleteUserByClient(client)
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

  private findUserByClient = (
    client: Socket,
  ): [string, SubscriptionUserDto | undefined] =>
    Object.entries(this.users).find(([, user]) => user.client === client)

  handleTyping = (
    client: Socket,
    receiverId: number,
    stopTyping?: boolean,
  ) => {
    const [userId, user] = this.findUserByClient(client)

    if (!user || !user.friends.includes(receiverId)) {
      return
    }

    const receiver = this.users[receiverId]

    if (!receiver) {
      return
    }

    receiver.client.send(
      JSON.stringify({
        [stopTyping ? "stopTyping" : "startTyping"]: parseInt(userId),
      }),
    )
  }

  private addUserFriend = (userId: number, friendId: number): boolean => {
    if (userId === friendId) {
      return false
    }

    const user = this.users[userId]

    if (user && !user.friends.includes(friendId)) {
      user.friends.push(friendId)

      return true
    }

    return false
  }

  handleNewMessage(userId: number, message: Message, fromName: string) {
    const user = this.users[userId]

    if (!user) {
      return
    }

    this.sendNewMessage(user.client, message, fromName)

    const isFriendAdded = this.addUserFriend(userId, message.from)
    this.addUserFriend(message.from, userId)

    const sender = this.users[message.from]

    isFriendAdded && this.sendNewUserOnline(sender.client, userId)
  }
}
