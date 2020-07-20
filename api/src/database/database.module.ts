import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule, ConfigService } from "@nestjs/config"

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (!process.env.DATABASE_URL) {
          return {
            type: "postgres" as any,
            host: configService.get("POSTGRES_HOST"),
            port: configService.get("POSTGRES_PORT"),
            username: configService.get("POSTGRES_USER"),
            password: configService.get("POSTGRES_PASSWORD"),
            database: configService.get("POSTGRES_DB") as string,
            entities: [__dirname + "/../**/*.entity.{ts,js}"],
            synchronize: true,
          }
        }

        const urlParams = process.env.DATABASE_URL.split(":")

        return {
          type: "postgres" as any,
          host: urlParams[2].split("@")[1],
          port: urlParams[3].split("/")[0],
          username: urlParams[1].slice(2),
          password: urlParams[2].split("@")[0],
          database: urlParams[3].split("/")[1],
          entities: [__dirname + "/../**/*.entity.{ts,js}"],
          synchronize: true,
        }
      },
    }),
  ],
})
export class DatabaseModule {}
