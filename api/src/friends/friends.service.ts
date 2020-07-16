import { Injectable } from "@nestjs/common"
import Friend from "./friend.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private friendsRepository: Repository<Friend>,
  ) {}

  async getUserFriends(userId: number): Promise<Friend[]> {
    return await this.friendsRepository.find({ userId })
  }

  async addUserFriend(userId: number, friendId: number): Promise<Friend> {
    const newFriend = await this.friendsRepository.create({
      userId,
      friendId,
    })
    await this.friendsRepository.save(newFriend)

    return newFriend
  }
}
