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
    const user = await this.usersRepository.findOne({ email })

    if (!user) {
      throw new HttpException("User wasn/t found", HttpStatus.NOT_FOUND)
    }

    return user
  }

  async create(data: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(data)
    await this.usersRepository.save(newUser)

    return newUser
  }

  async getById(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({ id: userId })

    if (!user) {
      throw new HttpException("User wasn't found", HttpStatus.NOT_FOUND)
    }

    return user
  }
}
