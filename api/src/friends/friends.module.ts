import { Module } from "@nestjs/common"
import { FriendsController } from "./friends.controller"
import { FriendsService } from "./friends.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import Friend from "./friend.entity"
import { UsersModule } from "../users/users.module"

@Module({
  imports: [TypeOrmModule.forFeature([Friend]), UsersModule],
  controllers: [FriendsController],
  providers: [FriendsService],
  exports: [FriendsService],
})
export class FriendsModule {}
