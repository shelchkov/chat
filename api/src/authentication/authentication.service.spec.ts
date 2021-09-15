import { Test } from "@nestjs/testing"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"

import { UsersService } from "../users/users.service"
import mockedConfigService from "../utils/mocks/config.service"
import mockedJwtService from "../utils/mocks/jwt.service"
import mockedUser from "../utils/mocks/user"
import { copy, removePassword } from "../utils/utils"
import PostgresErrorCode from "../database/postgresErrorCode.enum"

import { SignUpDto } from "./dto/signUp.dto"
import { AuthenticationService } from "./authentication.service"

jest.mock("bcrypt")

describe("AuthenticationService", () => {
  let authenticationService: AuthenticationService

  const bcryptCompare = jest.fn().mockResolvedValue(true)
  ;(bcrypt.compare as jest.Mock) = bcryptCompare

  const bcryptHash = jest.fn().mockResolvedValue("hashedPassword")
  ;(bcrypt.hash as jest.Mock) = bcryptHash

  const userData = copy(mockedUser)

  const create = jest.fn().mockReturnValue(userData)
  const getByEmail = jest.fn().mockResolvedValue(userData)

  beforeAll(
    async (): Promise<void> => {
      const usersService = { create, getByEmail }

      const module = await Test.createTestingModule({
        providers: [
          AuthenticationService,
          { provide: ConfigService, useValue: mockedConfigService },
          { provide: JwtService, useValue: mockedJwtService },
          { provide: UsersService, useValue: usersService },
        ],
      }).compile()

      authenticationService = await module.get<AuthenticationService>(
        AuthenticationService,
      )
    },
  )

  describe("when creating a new user", (): void => {
    const data = new SignUpDto()
    data.password = userData.password
    data.email = userData.email

    describe("and user doesn't exist", (): void => {
      it("should return new user", async (): Promise<void> => {
        const createdUser = await authenticationService.signUp(data)

        expect(createdUser).toEqual(removePassword(userData))
        expect(create).toBeCalledTimes(1)
      })
    })

    describe("and user exists", (): void => {
      beforeEach((): void => {
        create.mockRejectedValue({ code: PostgresErrorCode.UniqueViolation })
      })

      it("should throw an error", async (): Promise<void> => {
        await expect(authenticationService.signUp(data)).rejects.toThrow(
          "User already exists",
        )
      })
    })

    describe("and something goes wrong", (): void => {
      beforeEach((): void => {
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
      beforeAll((): void => {
        bcryptCompare.mockReturnValue(false)
      })

      afterAll(() => {
        bcryptCompare.mockResolvedValue(true)
      })

      it("should throw an error", async (): Promise<void> => {
        await expect(
          authenticationService.getAuthenticatedUser(email, password),
        ).rejects.toThrow()
      })
    })

    describe("and the provided password is valid", (): void => {
      beforeAll(() => {
        getByEmail.mockClear()
      })

      describe("and the user is found in the database", (): void => {
        it("should return the user data", async (): Promise<void> => {
          const user = await authenticationService.getAuthenticatedUser(
            email,
            password,
          )

          expect(user).toStrictEqual(removePassword(userData))
          expect(getByEmail).toBeCalledTimes(1)
        })
      })

      describe("and the user is not found in the database", (): void => {
        beforeEach((): void => {
          getByEmail.mockRejectedValueOnce(new Error("Error message"))
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
