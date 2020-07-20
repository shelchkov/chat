import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule, ConfigService } from "@nestjs/config"

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const type = "postgres" as any
        const host = process.env.DB_HOST || configService.get("POSTGRES_HOST")
        const port = process.env.DB_PORT || configService.get("POSTGRES_PORT")
        const username = process.env.DB_USER || configService.get("POSTGRES_USER")
        const password = process.env.DB_PASSWORD || configService.get("POSTGRES_PASSWORD")
        const database = process.env.DB_DATABASE || configService.get("POSTGRES_DB")

        return {
        type,
        host,
        port,
        username,
        password,
        database,
        entities: [__dirname + "/../**/*.entity.{ts,js}"],
        synchronize: true,
      }}
    }),
  ],
})
export class DatabaseModule {}
