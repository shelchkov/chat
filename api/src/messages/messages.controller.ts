import { Controller, Get, Post, Param, Body } from "@nestjs/common"
import { MessagesService } from "./messages.service"
import { SendMessageDto } from "./dto/sendMessage.dto"
import { GetMessagesDto } from "./dto/getMessages.dto"
import { MessageDto } from "./dto/message.dto"

@Controller("messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(":id")
  getMessagesFromUser(
    @Param("id") id: string,
    @Body() body: GetMessagesDto,
  ): Promise<MessageDto[]> {
    const { userId } = body

    return this.messagesService.getMessagesFromUser(
      Number(id),
      Number(userId),
    )
  }

  @Post(":to")
  sendMessageToUser(
    @Param("to") to: string,
    @Body() message: SendMessageDto,
  ): Promise<MessageDto> {
    return this.messagesService.sendMessageToUser(Number(to), message)
  }
}
