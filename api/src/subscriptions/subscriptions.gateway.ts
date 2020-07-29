import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets"
import Message from "../messages/message.entity"
import { AuthenticationService } from "../authentication/authentication.service"
import { Socket } from "socket.io"
import { SubscriptionUserDto } from "./dto/subscriptionUser.dto"
import { OnlineUserDto } from "./dto/onlineUser.dto"
import { UsersService } from "../users/users.service"

@WebSocketGateway({ port: 8080, path: "/events" })
export class SubscriptionsGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService,
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

  async handleConnection(client: Socket, request: Request): Promise<void> {
    const userId = this.authenticateUser(request)

    if (!userId) {
      client.send(JSON.stringify({ error: "No token" }))
      client.disconnect()

      return
    }

    const user = await this.usersService.getById(userId)

    if (!user) {
      client.send(JSON.stringify({ error: "Invalid token" }))
      client.disconnect()

      return
    }

    const friends = user.friends.map((friend): number => friend.id)
    userId && this.users.push({ userId, client, friends })
    this.sendUsersStatus()
  }

  handleDisconnect(client: Socket): void {
    this.users = this.users.filter((user): boolean => user.client !== client)
    this.sendUsersStatus()
  }

  sendMessageToUser(
    userId: number,
    message: Message,
    fromName: string,
  ): void {
    const user = this.users.find((user): boolean => user.userId === userId)
    if (user) {
      user.client.send(JSON.stringify({ newMessage: message, fromName }))

      const isFriendAdded = this.addUserFriend(userId, message.from)
      this.addUserFriend(message.from, userId)

      const sender = this.users.find(
        (user): boolean => user.userId === message.from,
      )
      isFriendAdded &&
        sender.client.send(JSON.stringify({ newUserOnline: userId }))
    }
  }

  private sendUsersStatus(): void {
    this.users.forEach((user): void => {
      const onlineUsers = this.users
        .filter((onlineUser): boolean =>
          user.friends.includes(onlineUser.userId),
        )
        .map((user): OnlineUserDto => ({ userId: user.userId }))
      user.client.send(JSON.stringify({ online: onlineUsers }))
    })
  }

  private addUserFriend(
    userId: number,
    friendId: number,
  ): boolean | undefined {
    if (userId === friendId) {
      return false
    }

    const user = this.users.find((user): boolean => user.userId === userId)

    if (user.friends.includes(friendId)) {
      return
    }

    user.friends = [...user.friends, friendId]
    this.users = [
      ...this.users.filter((user): boolean => user.userId !== userId),
      user,
    ]

    return true
  }
}
