import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from "@nestjs/websockets"
import { Socket } from "socket.io"

import Message from "../messages/message.entity"
import { UsersService } from "../users/users.service"

import { SubscriptionsService } from "./subscriptions.service"

const options: Record<string, string | number> = { path: "/events" }

if (process.env.NODE_ENV !== "production") {
  options.port = 8080
}

@WebSocketGateway(options)
export class SubscriptionsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly usersService: UsersService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async handleConnection(client: Socket, request: Request): Promise<void> {
    const userId = this.subscriptionsService.authenticateUser(request)

    if (!userId) {
      return this.subscriptionsService.sendErrorAndDisconnect(
        client,
        "No token",
      )
    }

    const user = await this.usersService.getById(userId)

    if (!user) {
      return this.subscriptionsService.sendErrorAndDisconnect(
        client,
        "Invalid token",
      )
    }

    this.subscriptionsService.addNewUser(client, user)
    this.subscriptionsService.sendUsersStatus()
  }

  handleDisconnect(client: Socket): void {
    return this.subscriptionsService.handleDisconnect(client)
  }

  sendMessageToUser(
    userId: number,
    message: Message,
    fromName: string,
  ): void {
    const user = this.subscriptionsService.findUserById(userId)

    if (!user) {
      return
    }

    this.subscriptionsService.sendNewMessage(user.client, message, fromName)

    const isFriendAdded = this.subscriptionsService.addUserFriend(
      userId,
      message.from,
    )
    this.subscriptionsService.addUserFriend(message.from, userId)

    const sender = this.subscriptionsService.findUserById(message.from)

    isFriendAdded &&
      this.subscriptionsService.sendNewUserOnline(sender.client, userId)
  }

  @SubscribeMessage("typing")
  handleTyping(
    client: Socket,
    data: { startTyping?: number; stopTyping?: number },
  ): void {
    if (data.startTyping) {
      this.subscriptionsService.handleTyping(client, data.startTyping)
    }

    if (data.stopTyping) {
      this.subscriptionsService.handleTyping(client, data.stopTyping, true)
    }
  }
}
