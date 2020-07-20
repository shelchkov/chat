import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as cookieParser from "cookie-parser"

const clientUrl = "http://localhost:3000"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(cookieParser())

  const options = {
    credentials: true,
    origin: clientUrl,
  }

  app.enableCors(options)
  await app.listen(process.env.PORT || "5000")
}
bootstrap()
