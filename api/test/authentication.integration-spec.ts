import { INestApplication, ValidationPipe, HttpStatus } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { AuthenticationController } from "../src/authentication/authentication.controller"
import { AuthenticationService } from "../src/authentication/authentication.service"
import { UsersService } from "../src/users/users.service"
import { ConfigService } from "@nestjs/config"
import mockedConfigService from "../src/utils/mocks/config.service"
import { JwtModule } from "@nestjs/jwt"
import { getRepositoryToken } from "@nestjs/typeorm"
import User from "../src/users/user.entity"
import mockedUser from "../src/utils/mocks/user"
import * as request from "supertest"
import * as bcrypt from "bcrypt"
import PostgresErrorCode from "../src/database/postgresErrorCode.enum"
import {
  copy,
  removePassword,
  getCookieParams,
  removePasswords,
} from "../src/utils/utils"
import { JwtStrategy } from "../src/authentication/jwt.strategy"
import { LocalStrategy } from "../src/authentication/local.strategy"

const routes = {
  signUp: "/authentication/sign-up",
  signIn: "/authentication/sign-in",
  signOut: "/authentication/sign-out",
  authentication: "/authentication",
}

jest.mock("bcrypt")

describe("authentication", (): void => {
  let app: INestApplication
  let userData: User

  let create: jest.Mock
  let findOne: jest.Mock

  let bcryptHash: jest.Mock
  let bcryptCompare: jest.Mock

  let userCookie: string

  beforeEach(
    async (): Promise<void> => {
      userData = copy(mockedUser)
      create = jest.fn().mockResolvedValue(userData)
      findOne = jest.fn().mockResolvedValue(userData)
      const usersRepository = {
        create,
        save: jest.fn().mockReturnValue(Promise.resolve()),
        findOne,
      }

      bcryptHash = jest.fn().mockResolvedValue("hashedPassword")
      ;(bcrypt.hash as jest.Mock) = bcryptHash
      bcryptCompare = jest.fn().mockResolvedValue(true)
      ;(bcrypt.compare as jest.Mock) = bcryptCompare

      const module = await Test.createTestingModule({
        imports: [
          JwtModule.register({
            secret: "secret",
            signOptions: { expiresIn: "3600s" },
          }),
        ],
        controllers: [AuthenticationController],
        providers: [
          AuthenticationService,
          UsersService,
          {
            provide: ConfigService,
            useValue: mockedConfigService,
          },
          {
            provide: getRepositoryToken(User),
            useValue: usersRepository,
          },
          JwtStrategy,
          LocalStrategy,
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
          .expect(HttpStatus.BAD_REQUEST)
      })
    })

    describe("and using valid data", (): void => {
      it("should respond with the data of the user without password", async (): Promise<
        void
      > => {
        const expectedData = removePassword(userData)

        const response = await request(app.getHttpServer())
          .post(routes.signUp)
          .send(signUpData)
          .expect(201)
          .expect(expectedData)

        userCookie = response.header["set-cookie"][0]
        const cookieParams = getCookieParams(userCookie)

        expect(cookieParams["Authentication"]).toBeDefined()
        expect(cookieParams["Authentication"].length).toBeGreaterThan(0)
        expect(cookieParams["HttpOnly"]).toBeDefined()
        expect(cookieParams["Max-Age"]).toBeDefined()
        expect(cookieParams["Max-Age"].length).toBeGreaterThan(0)

        return
      })
    })
  })

  describe("when logging in", (): void => {
    describe("and authentication data is corect", (): void => {
      const signInData = {
        email: mockedUser.email,
        password: mockedUser.password,
      }

      it("should return user data", async (): Promise<void> => {
        const expectedData = removePassword(mockedUser)
        expectedData.friends = removePasswords(expectedData.friends)

        const response = await request(app.getHttpServer())
          .post(routes.signIn)
          .send(signInData)
          .expect(200)
          .expect(expectedData)

        return
      })
    })

    describe("and authentication data is incorrect", (): void => {
      const signInData = {
        email: mockedUser.email,
        password: mockedUser.password + "1",
      }

      beforeEach((): void => {
        bcryptCompare.mockResolvedValue(false)
      })

      it("should throw an error if password is incorrect", (): Test => {
        return request(app.getHttpServer())
          .post(routes.signIn)
          .send(signInData)
          .expect(400)
          .expect(HttpStatus.BAD_REQUEST)
      })

      it("should throw an error if email is incorrect", (): Test => {
        signInData.email = signInData.email + "a"
        findOne.mockRejectedValue(undefined)
        bcryptCompare.mockResolvedValue(true)

        return request(app.getHttpServer())
          .post(routes.signIn)
          .send(signInData)
          .expect(400)
          .expect(HttpStatus.BAD_REQUEST)
      })
    })
  })

  describe("when signing out", (): void => {
    // describe("and user is logged in", (): void => {
    //   it("should respond with 200 code", (): Test => {
    //     userCookie = "Authentication=Hi"
    //     return request(app.getHttpServer())
    //       .post(routes.signOut)
    //       .set("Authentication", userCookie)
    //       .send()
    //       .expect(200)
    //       .expect({ success: true })
    //   })
    // })

    describe("and user is not logged in", (): void => {
      it("should throw an error", (): Test => {
        return request(app.getHttpServer())
          .post(routes.signOut)
          .send()
          .expect(401)
      })
    })
  })

  describe("when requesting authenticated user", (): void => {
    describe("and user is not authorized", (): void => {
      it("should throw an error", (): Test => {
        return request(app.getHttpServer())
          .get(routes.authentication)
          .send()
          .expect(401)
      })
    })
  })
})
