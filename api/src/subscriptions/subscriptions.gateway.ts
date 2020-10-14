import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets"
import { Socket } from "socket.io"

import Message from "../messages/message.entity"
import { UsersService } from "../users/users.service"

import { SubscriptionsService } from "./subscriptions.service"

@WebSocketGateway({ port: 8080, path: "/events" })
export class SubscriptionsGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly usersService: UsersService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  async handleConnection(client: Socket, request: Request): Promise<void> {
    const userId = this.subscriptionsService.authenticateUser(request)

    if (!userId) {
      this.subscriptionsService.sendErrorAndDisconnect(client, "No token")

      return
    }

    const user = await this.usersService.getById(userId)

    if (!user) {
      this.subscriptionsService.sendErrorAndDisconnect(
        client,
        "Invalid token",
      )

      return
    }

    this.subscriptionsService.addNewUser(client, user)
    this.subscriptionsService.sendUsersStatus()
  }

  handleDisconnect(client: Socket): void {
    this.subscriptionsService.deleteUserByClient(client)
    this.subscriptionsService.sendUsersStatus()
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
}
