import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common"
import { MessagesService } from "./messages.service"
import { SendMessageDto } from "./dto/sendMessage.dto"
import Message from "./message.entity"
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard"
import RequestWithUser from "../authentication/requestWithUser.interface"

@Controller("messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(":id")
  @UseGuards(JwtAuthenticationGuard)
  getMessagesFromUser(
    @Param("id") id: string,
    @Req() request: RequestWithUser,
  ): Promise<Message[]> {
    const userId = request.user.id

    return this.messagesService.getMessagesFromUser(
      Number(id),
      Number(userId),
    )
  }

  @Post(":to")
  @UseGuards(JwtAuthenticationGuard)
  sendMessageToUser(
    @Param("to") to: string,
    @Body() message: SendMessageDto,
    @Req() request: RequestWithUser,
  ): Promise<Message> {
    const userId = request.user.id

    return this.messagesService.sendMessageToUser(
      Number(to),
      Number(userId),
      message.text,
      request.user.name,
    )
  }
}
