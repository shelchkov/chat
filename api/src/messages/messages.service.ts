import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { SendMessageDto } from "./dto/sendMessage.dto"
import { MessageDto } from "./dto/message.dto"

@Injectable()
export class MessagesService {
  private messages = []
  private lastMessageId = 0

  getMessagesFromUser(id: number, userId: number): MessageDto[] {
    const foundMessages = this.messages.filter(
      message =>
        (message.from === id && message.to === userId) ||
        (message.from === userId && message.to === id),
    )

    if (!foundMessages.length) {
      throw new HttpException("Messages weren't found", HttpStatus.NOT_FOUND)
    }

    return foundMessages
  }

  sendMessageToUser(to: number, message: SendMessageDto): MessageDto {
    const newMessage = {
      ...message,
      id: ++this.lastMessageId,
      to,
    }

    this.messages.push(newMessage)
    return newMessage
  }
}
