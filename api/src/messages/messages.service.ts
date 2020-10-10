import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { UsersService } from "../users/users.service"
import { SubscriptionsGateway } from "../subscriptions/subscriptions.gateway"

import Message from "./message.entity"

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private readonly usersService: UsersService,
    private readonly subscriptionsProvider: SubscriptionsGateway,
  ) {}

  async getMessagesFromUser(id: number, userId: number): Promise<Message[]> {
    const friend = await this.usersService.getUsersFriend(userId, id)

    if (!friend) {
      throw new HttpException(
        "User needs to be added to friends list to receive messages",
        HttpStatus.BAD_REQUEST,
      )
    }

    return await this.messagesRepository.find({
      where: [
        { from: id, to: userId },
        { from: userId, to: id },
      ],
    })
  }

  async sendMessageToUser(
    to: number,
    from: number,
    text: string,
    fromName: string,
  ): Promise<Message> {
    const friend = await this.usersService.getUsersFriend(from, to)
    if (!friend) {
      await Promise.all([
        await this.usersService.addFriend(from, to),
        await this.usersService.addFriend(to, from),
      ])
    }

    const newMessage = this.messagesRepository.create({
      to,
      from,
      text,
    })
    await this.messagesRepository.save(newMessage)

    this.subscriptionsProvider.sendMessageToUser(to, newMessage, fromName)

    return newMessage
  }
}
