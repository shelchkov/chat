import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets"
import Message from "../messages/message.entity"
import { AuthenticationService } from "../authentication/authentication.service"
import { Socket } from "socket.io"
import { SubscriptionUserDto } from "./dto/subscriptionUser.dto"

@WebSocketGateway({ port: 8080, path: "/events" })
export class SubscriptionsGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}
  private users: SubscriptionUserDto[] = []

  private authenticateUser(request: Request): number | undefined {
    const cookie = request.headers["cookie"]

    const authentication = cookie
      .split("; ")
      .find(
        (parameter: string): boolean =>
          parameter.split("=")[0] === "Authentication",
      )
    const token = authentication.split("=")[1]

    const userId = this.authenticationService.getUserIdFromToken(token)

    return userId
  }

  handleConnection(client: Socket, request: Request): void {
    const userId = this.authenticateUser(request)
    userId && this.users.push({ userId, client })
  }

  handleDisconnect(client: Socket): void {
    this.users = this.users.filter((user): boolean => user.client !== client)
  }

  sendMessageToUser(userId: number, message: Message): void {
    const user = this.users.find((user): boolean => user.userId === userId)
    user && user.client.send(JSON.stringify(message))
  }
}
