import { Module } from "@nestjs/common"
import { AuthenticationController } from "./authentication.controller"
import { AuthenticationService } from "./authentication.service"
import { UsersModule } from "../users/users.module"
import { PassportModule } from "@nestjs/passport"
import { LocalStrategy } from "./local.strategy"

@Module({
  imports: [UsersModule, PassportModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, LocalStrategy],
})
export class AuthenticationModule {}
