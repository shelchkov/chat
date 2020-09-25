import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { AuthenticationController } from "../src/authentication/authentication.controller"
import { AuthenticationService } from "../src/authentication/authentication.service"
import { UsersService } from "../src/users/users.service"
import { ConfigService } from "@nestjs/config"
import mockedConfigService from "../src/utils/mocks/config.service"
import mockedJwtService from "../src/utils/mocks/jwt.service"
import { JwtService } from "@nestjs/jwt"
import { getRepositoryToken } from "@nestjs/typeorm"
import User from "../src/users/user.entity"
import mockedUser from "../src/utils/mocks/user.mock"
import * as request from "supertest"
import * as bcrypt from "bcrypt"
import PostgresErrorCode from "../src/database/postgresErrorCode.enum"

const routes = { signUp: "/authentication/sign-up" }

jest.mock("bcrypt")

describe("authentication", (): void => {
  let app: INestApplication
  let userData: User

  let create: jest.Mock

  let bcryptHash: jest.Mock

  beforeEach(
    async (): Promise<void> => {
      // TODO: Refactor
      userData = { ...mockedUser }
      create = jest.fn().mockResolvedValue(userData)
      const usersRepository = {
        create,
        save: jest.fn().mockReturnValue(Promise.resolve()),
      }

      bcryptHash = jest.fn().mockResolvedValue("hashedPassword")
      ;(bcrypt.hash as jest.Mock) = bcryptHash

      const module = await Test.createTestingModule({
        controllers: [AuthenticationController],
        providers: [
          AuthenticationService,
          UsersService,
          {
            provide: ConfigService,
            useValue: mockedConfigService,
          },
          {
            provide: JwtService,
            useValue: mockedJwtService,
          },
          {
            provide: getRepositoryToken(User),
            useValue: usersRepository,
          },
        ],
      }).compile()

      app = module.createNestApplication()
      app.useGlobalPipes(new ValidationPipe())
      await app.init()
    },
  )

  describe("when registering", (): void => {
    const signUpData = {
      email: mockedUser.email,
      name: mockedUser.name,
      password: mockedUser.password,
    }

    describe("and using valid data", (): void => {
      it("should respond with the data of the user without password", (): Test => {
        // Refactor
        const expectedData = { ...userData }
        delete expectedData.password

        return request(app.getHttpServer())
          .post(routes.signUp)
          .send(signUpData)
          .expect(201)
          .expect(expectedData)
      })
    })

    describe("and using invalid data", (): void => {
      it("should throw an error", (): Test => {
        return request(app.getHttpServer())
          .post(routes.signUp)
          .send({ name: mockedUser.name })
          .expect(400)
      })
    })

    describe("and user is already exists", (): void => {
      beforeEach((): void => {
        create.mockRejectedValue({ code: PostgresErrorCode.UniqueViolation })
      })

      it("should throw an error", (): Test => {
        return request(app.getHttpServer())
          .post(routes.signUp)
          .send(signUpData)
          .expect(400)
      })
    })
  })
})
