import { IsNumberString } from "class-validator"

export class GetMessagesDto {
  @IsNumberString()
  id: string
}
