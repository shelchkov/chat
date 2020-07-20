import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as cookieParser from "cookie-parser"
import { NestExpressApplication } from "@nestjs/platform-express"

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
  await app.listen(process.env.PORT || "5000")
}
bootstrap()
