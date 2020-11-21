import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
} from "@nestjs/common"

import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard"
import RequestWithUser from "../authentication/requestWithUser.interface"

import { MessagesService } from "./messages.service"
import { SendMessageDto, SendMessageParamsDto } from "./dto/sendMessage.dto"
import Message from "./message.entity"
import { GetMessagesDto } from "./dto/getMessages.dto"

@Controller("messages")
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(":id")
  @UseGuards(JwtAuthenticationGuard)
  getMessagesFromUser(
    @Param() { id }: GetMessagesDto,
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
    @Param() { to }: SendMessageParamsDto,
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
