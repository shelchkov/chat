import { Module } from "@nestjs/common"
import { MessagesController } from "./messages.controller"
import { MessagesService } from "./messages.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import Message from "./message.entity"
import { UsersModule } from "../users/users.module"

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UsersModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
