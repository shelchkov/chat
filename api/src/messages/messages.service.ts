import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { SendMessageDto } from "./dto/sendMessage.dto"
import { MessageDto } from "./dto/message.dto"
import { InjectRepository } from "@nestjs/typeorm"
import Message from "./message.entity"
import { Repository } from "typeorm"

@Injectable()
export class MessagesService {
  constructor(
  	@InjectRepository(Message)
  	private messagesRepository: Repository<Message>
  ) {}

  private messages = []
  private lastMessageId = 0

  async getMessagesFromUser(id: number, userId: number): Promise<MessageDto[]> {
  	const foundMessages = await this.messagesRepository.find({ where: [
  		{ from: id, to: userId },
  		{ from: userId, to: id }
  	] })

    if (!foundMessages.length) {
      throw new HttpException("Messages weren't found", HttpStatus.NOT_FOUND)
    }

    return foundMessages
  }

  async sendMessageToUser(to: number, message: SendMessageDto): Promise<MessageDto> {
    const newMessage = this.messagesRepository.create({
      ...message,
      to,
    })
    await this.messagesRepository.save(newMessage)

    return newMessage
  }
}
