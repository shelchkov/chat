import { Test } from "@nestjs/testing"
import { AuthenticationService } from "./authentication.service"
import { UsersService } from "../users/users.service"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import User from "../users/user.entity"
import { getRepositoryToken } from "@nestjs/typeorm"
import mockedConfigService from "../utils/mocks/config.service"
import mockedJwtService from "../utils/mocks/jwt.service"
import * as bcrypt from "bcrypt"
import mockedUser from "../utils/mocks/user"
import { copy, removePassword } from "../utils/utils"
import { SignUpDto } from "./dto/signUp.dto"
import PostgresErrorCode from "../database/postgresErrorCode.enum"

jest.mock("bcrypt")

describe("AuthenticationService", () => {
  let authenticationService: AuthenticationService
  let usersService: UsersService

  let bcryptCompare: jest.Mock
  let bcryptHash: jest.Mock

  let findOne: jest.Mock
  let create: jest.Mock
  let save: jest.Mock

  let userData: User

  beforeEach(
    async (): Promise<void> => {
      bcryptCompare = jest.fn().mockReturnValue(true)
      ;(bcrypt.compare as jest.Mock) = bcryptCompare
      bcryptHash = jest.fn().mockResolvedValue("hashedPassword")
      ;(bcrypt.hash as jest.Mock) = bcryptHash

      userData = copy(mockedUser)
      findOne = jest.fn().mockResolvedValue(userData)
      create = jest.fn().mockReturnValue(userData)
      save = jest.fn().mockResolvedValue(userData)
      const userRepository = {
        findOne,
        create,
        save,
      }

      const module = await Test.createTestingModule({
        providers: [
          AuthenticationService,
          UsersService,
          { provide: ConfigService, useValue: mockedConfigService },
          { provide: JwtService, useValue: mockedJwtService },
          { provide: getRepositoryToken(User), useValue: userRepository },
        ],
      }).compile()

      authenticationService = await module.get<AuthenticationService>(
        AuthenticationService,
      )
      usersService = await module.get(UsersService)
    },
  )

  describe("when creating a new user", (): void => {
    let data: SignUpDto

    describe("and user doesn't exist", (): void => {
      beforeEach((): void => {
        create.mockReturnValue(userData)
        data = new SignUpDto()
        data.password = userData.password
        data.email = userData.email
        bcryptHash.mockResolvedValue("hashedPassword")
        save.mockResolvedValue(userData)
      })

      it("should return new user", async (): Promise<void> => {
        const createSpy = jest.spyOn(usersService, "create")
        const createdUser = await authenticationService.signUp(data)

        expect(createdUser).toStrictEqual(removePassword(userData))
        expect(createSpy).toBeCalledTimes(1)
      })
    })

    describe("and user exists", (): void => {
      beforeEach((): void => {
        data = new SignUpDto()
        data.password = userData.password
        data.email = userData.email
        create.mockRejectedValue({ code: PostgresErrorCode.UniqueViolation })
        bcryptHash.mockResolvedValue("hashedPassword")
        save.mockResolvedValue(userData)
      })

      it("should throw an error", async (): Promise<void> => {
        await expect(authenticationService.signUp(data)).rejects.toThrow(
          "User already exists",
        )
      })
    })

    describe("and something goes wrong", (): void => {
      beforeEach((): void => {
        data = new SignUpDto()
        create.mockRejectedValue({ code: "errorCode" })
      })

      it("should throw an error", async (): Promise<void> => {
        await expect(authenticationService.signUp(data)).rejects.toThrow()
      })
    })
  })

  describe("when accessing the data of authenticated user", (): void => {
    const email = "test@test.com"
    const password = "password"

    describe("and the provided password is not valid", (): void => {
      beforeEach((): void => {
        bcryptCompare.mockReturnValue(false)
      })

      it("should throw an error", async (): Promise<void> => {
        await expect(
          authenticationService.getAuthenticatedUser(email, password),
        ).rejects.toThrow()
      })
    })

    describe("and the provided password is valid", (): void => {
      beforeEach((): void => {
        bcryptCompare.mockReturnValue(true)
      })

      describe("and the user is found in the database", (): void => {
        beforeEach((): void => {
          findOne.mockResolvedValue(userData)
        })

        it("should return the user data", async (): Promise<void> => {
          const getByEmailSpy = jest.spyOn(usersService, "getByEmail")

          const user = await authenticationService.getAuthenticatedUser(
            email,
            password,
          )

          expect(user).toStrictEqual(removePassword(userData))
          expect(getByEmailSpy).toBeCalledTimes(1)
        })
      })

      describe("and the user is not found in the database", (): void => {
        beforeEach((): void => {
          findOne.mockResolvedValue(undefined)
        })

        it("should throw an error", async (): Promise<void> => {
          await expect(
            authenticationService.getAuthenticatedUser(email, password),
          ).rejects.toThrow()
        })
      })
    })
  })

  describe("when creating a cookie", (): void => {
    it("should retrun a string", (): void => {
      const userId = 1

      expect(
        typeof authenticationService.getCookieWithJwtToken(userId),
      ).toEqual("string")
    })
  })

  describe("when creating a cookie for sign out", (): void => {
    it("should return a string", (): void => {
      expect(typeof authenticationService.getCookieForLogOut()).toEqual(
        "string",
      )
    })
  })

  describe("when getting user id from token", (): void => {
    it("should return number", (): void => {
      const token = "token"

      expect(typeof authenticationService.getUserIdFromToken(token)).toEqual(
        "number",
      )
    })
  })
})
