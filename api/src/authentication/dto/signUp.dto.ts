import { IsEmail, MinLength, IsString, IsNotEmpty } from "class-validator"

export class SignUpDto {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @MinLength(6)
  password: string
}
