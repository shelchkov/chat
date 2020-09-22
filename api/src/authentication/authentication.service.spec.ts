import { Test } from "@nestjs/testing"
import { AuthenticationService } from "./authentication.service"
import { UsersService } from "../users/users.service"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { JwtModule } from "@nestjs/jwt"
import * as Joi from "joi"
import User from "../users/user.entity"
import { getRepositoryToken } from "@nestjs/typeorm"

describe("AuthenticationService", () => {
  let authenticationService: AuthenticationService

  beforeEach(
    async (): Promise<void> => {
      const module = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            validationSchema: Joi.object({
              POSTGRES_HOST: Joi.string().required(),
              POSTGRES_PORT: Joi.string().required(),
              POSTGRES_USER: Joi.string().required(),
              POSTGRES_PASSWORD: Joi.string().required(),
              POSTGRES_DB: Joi.string().required(),
              JWT_SECRET: Joi.string().required(),
              JWT_EXPIRATION_TIME: Joi.string().required(),
              POST: Joi.number(),
            }),
          }),
          JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
              secret: configService.get("JWT_SECRET"),
              signOptions: {
                expiresIn: `${configService.get("JWT_EXPIRATION_TIME")}s`,
              },
            }),
          }),
        ],
        providers: [
          AuthenticationService,
          UsersService,
          { provide: getRepositoryToken(User), useValue: {} },
        ],
      }).compile()

      authenticationService = await module.get<AuthenticationService>(
        AuthenticationService,
      )
    },
  )

  describe("when creating a cookie", (): void => {
    it("should retrun a string", (): void => {
      const userId = 1

      expect(
        typeof authenticationService.getCookieWithJwtToken(userId),
      ).toEqual("string")
    })
  })
})
