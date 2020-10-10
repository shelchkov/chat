import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { UsersModule } from "../users/users.module"
import { SubscriptionsModule } from "../subscriptions/subscriptions.module"

import { MessagesController } from "./messages.controller"
import { MessagesService } from "./messages.service"
import Message from "./message.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    UsersModule,
    SubscriptionsModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
