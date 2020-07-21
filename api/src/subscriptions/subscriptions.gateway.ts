import { WebSocketGateway, OnGatewayConnection } from "@nestjs/websockets"
import Message from "../messages/message.entity"
import { AuthenticationService } from "../authentication/authentication.service"
import { Socket } from "socket.io"

@WebSocketGateway({ port: 8080, path: "/events" })
export class SubscriptionsGateway implements OnGatewayConnection {
  constructor(
    private readonly authenticationService: AuthenticationService,
  ) {}
  private users = []

  handleConnection(client: Socket, request: Request): void {
    const cookie = request.headers["cookie"]

    const authentication = cookie
      .split("; ")
      .find(
        (parameter: string): boolean =>
          parameter.split("=")[0] === "Authentication",
      )
    const token = authentication.split("=")[1]

    const userId = this.authenticationService.getUserIdFromToken(token)
    userId && this.users.push({ userId, client })
  }

  sendMessageToUser(userId: number, message: Message): void {
    const user = this.users.find((user): boolean => user.userId === userId)
    user && user.client.send(JSON.stringify(message))
  }
}
