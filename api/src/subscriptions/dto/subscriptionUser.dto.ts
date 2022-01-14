import { Socket } from "socket.io"

export class SubscriptionUserDto {
  client: Socket
  friends: number[]
}
