import { Module } from "@nestjs/common"
import { MessagesController } from "./messages.controller"
import { MessagesService } from "./messages.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import Message from "./message.entity"
import { FriendsModule } from "../friends/friends.module"

@Module({
  imports: [TypeOrmModule.forFeature([Message]), FriendsModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
