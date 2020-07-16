import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import Friend from "./friend.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UsersService } from "../users/users.service"

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private friendsRepository: Repository<Friend>,
    private readonly usersService: UsersService,
  ) {}

  async getUserFriends(userId: number): Promise<Friend[]> {
    return await this.friendsRepository.find({ userId })
  }

  async addUserFriend(userId: number, friendId: number): Promise<Friend> {
    if (userId === friendId) {
      throw new HttpException(
        "Can't add yourself as a friend",
        HttpStatus.BAD_REQUEST,
      )
    }

    try {
      await this.usersService.getById(friendId)
    } catch {
      throw new HttpException("Friend doesn't exist", HttpStatus.NOT_FOUND)
    }

    const existingFriend = await this.getUserFriend(userId, friendId)
    if (existingFriend) {
      throw new HttpException(
        "User was already added to friends list",
        HttpStatus.BAD_REQUEST,
      )
    }

    const newFriend = await this.friendsRepository.create({
      userId,
      friendId,
    })
    await this.friendsRepository.save(newFriend)

    return newFriend
  }

  private async getUserFriend(userId: number, friendId): Promise<Friend> {
    return this.friendsRepository.findOne({ userId, friendId })
  }
}
