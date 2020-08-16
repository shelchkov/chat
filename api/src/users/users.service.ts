import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import User from "./user.entity"
import { Repository } from "typeorm"
import { CreateUserDto } from "./dto/createUser.dto"

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne(
      { email },
      { relations: ["friends"] },
    )

    if (!user) {
      throw new HttpException("User wasn/t found", HttpStatus.NOT_FOUND)
    }

    return user
  }

  async create(data: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create({ ...data, friends: [] })
    await this.usersRepository.save(newUser)

    return newUser
  }

  async getById(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne(
      { id: userId },
      { relations: ["friends"] },
    )

    if (!user) {
      throw new HttpException("User wasn't found", HttpStatus.NOT_FOUND)
    }

    return user
  }

  async searchUsers(query: string, userId: number): Promise<User[]> {
    const users = await this.usersRepository.find({
      where: `(name ILIKE '%${query}%') AND ("id" != '${String(userId)}')`,
    })

    return users.map((user): User => ({ ...user, password: undefined }))
  }

  private findUsersFriend(user: User, friendId: number): User | undefined {
    return user.friends.find((friend): boolean => friend.id === friendId)
  }

  async addFriend(userId: number, friendId: number): Promise<User> {
    if (userId === friendId) {
      throw new HttpException(
        "Can't add yourself to users list",
        HttpStatus.BAD_REQUEST,
      )
    }

    const [newFriend, user] = await Promise.all([
      await this.getById(friendId), 
      await this.getById(userId)
    ])

    if (this.findUsersFriend(user, friendId)) {
      throw new HttpException(
        "User was already added to friends list",
        HttpStatus.BAD_REQUEST,
      )
    }

    newFriend.friends = undefined

    const newUser = { ...user, friends: [...user.friends, newFriend] }
    this.usersRepository.save(newUser)

    return newUser
  }

  async getUsersFriend(
    userId: number,
    friendId: number,
  ): Promise<User | undefined> {
    const user = await this.getById(userId)

    return this.findUsersFriend(user, friendId)
  }
}
