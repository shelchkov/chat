import { Socket } from "socket.io"

export class SubscriptionUserDto {
  userId: number
  client: Socket
}
