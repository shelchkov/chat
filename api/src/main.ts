import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as cookieParser from "cookie-parser"
import { NestExpressApplication } from "@nestjs/platform-express"
import { WsAdapter } from "@nestjs/platform-ws"
import { ValidationPipe } from "@nestjs/common"

const clientUrl = "http://localhost:3000"

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.use(cookieParser())

  const options =
    process.env.NODE_ENV === "production"
      ? {}
      : {
          credentials: true,
          origin: clientUrl,
        }

  app.enableCors(options)
  app.useWebSocketAdapter(new WsAdapter(app))
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.PORT || "5000")
}
bootstrap()
