import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from "@nestjs/websockets"
import { Socket } from "socket.io"

import Message from "../messages/message.entity"

import { SubscriptionsService } from "./subscriptions.service"

const options: Record<string, string | number> = { path: "/events" }

if (process.env.NODE_ENV !== "production") {
  options.port = 8080
}

@WebSocketGateway(options)
export class SubscriptionsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  async handleConnection(client: Socket, request: Request): Promise<void> {
    return this.subscriptionsService.handleConnection(client, request)
  }

  handleDisconnect(client: Socket): void {
    return this.subscriptionsService.handleDisconnect(client)
  }

  sendMessageToUser(
    userId: number,
    message: Message,
    fromName: string,
  ): void {
    return this.subscriptionsService.handleNewMessage(
      userId,
      message,
      fromName,
    )
  }

  @SubscribeMessage("typing")
  handleTyping(
    client: Socket,
    data: { startTyping?: number; stopTyping?: number },
  ): void {
    if (data.startTyping) {
      return this.subscriptionsService.handleTyping(client, data.startTyping)
    }

    if (data.stopTyping) {
      return this.subscriptionsService.handleTyping(
        client,
        data.stopTyping,
        true,
      )
    }
  }
}
