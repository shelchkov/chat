import { IsNumberString } from "class-validator"

export class SearchUsersDto {
  @IsNumberString()
  q: string
}
