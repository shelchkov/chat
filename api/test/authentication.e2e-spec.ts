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

const routes = { signUp: "/authentication/sign-up" }

describe("authentication", (): void => {
  let app: INestApplication
  let userData: User

  beforeEach(
    async (): Promise<void> => {
      userData = { ...mockedUser }
      const usersRepository = {
        create: jest.fn().mockResolvedValue(userData),
        save: jest.fn().mockReturnValue(Promise.resolve()),
      }

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
    describe("and using valid data", (): void => {
      it("should respond with the data of the user without password", (): Test => {
        const expectedData = { ...userData }
        delete expectedData.password

        return request(app.getHttpServer())
          .post(routes.signUp)
          .send({
            email: mockedUser.email,
            name: mockedUser.name,
            password: mockedUser.password,
          })
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
  })
})
