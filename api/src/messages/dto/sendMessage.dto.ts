import { IsString, IsNotEmpty, IsNumberString } from "class-validator"

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  text: string
}

export class SendMessageParamsDto {
  @IsNumberString()
  to: string
}
