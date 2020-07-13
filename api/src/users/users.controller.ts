import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from "./users.service"
import User from "./user.entity"
import { SearchDto } from "./dto/search.dto"

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	searchUsers(@Query("q") query: string): Promise<User[]> {
		console.log(query)
		return this.usersService.searchUsers(query)
	}
}
