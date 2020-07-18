import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { MessagesModule } from "./messages/messages.module"
import { DatabaseModule } from "./database/database.module"
import { AuthenticationModule } from "./authentication/authentication.module"

@Module({
  imports: [
    MessagesModule,
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
