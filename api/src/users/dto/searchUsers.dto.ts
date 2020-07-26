import { IsString, IsNotEmpty } from "class-validator"

export class SearchUsersDto {
  @IsString()
  @IsNotEmpty()
  q: string
}
