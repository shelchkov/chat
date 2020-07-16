import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import Message from "./message.entity"
import { Repository } from "typeorm"
import { FriendsService } from "../friends/friends.service"

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private readonly friendsService: FriendsService,
  ) {}

  async getMessagesFromUser(id: number, userId: number): Promise<Message[]> {
    const friend = await this.friendsService.getUserFriend(userId, id)
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
  ): Promise<Message> {
    const friend = await this.friendsService.getUserFriend(from, to)
    if (!friend) {
      await this.friendsService.addUserFriend(from, to)
    }

    const newMessage = this.messagesRepository.create({
      to,
      from,
      text,
    })
    await this.messagesRepository.save(newMessage)

    return newMessage
  }
}
