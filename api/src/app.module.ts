import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MessagesModule } from "./messages/messages.module"
import { DatabaseModule } from "./database/database.module"
import { AuthenticationModule } from "./authentication/authentication.module"
import { ServeStaticModule } from "@nestjs/serve-static"
import { join } from "path"

@Module({
  imports: [
    MessagesModule,
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthenticationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "../src/static"),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
