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
import mockedUser from "../utils/mocks/user.mock"
import { copy, removePassword } from "../utils/utils"

jest.mock("bcrypt")

describe("AuthenticationService", () => {
  let authenticationService: AuthenticationService
  let bcryptCompare: jest.Mock
  let findOne: jest.Mock
  let userData: User
  let usersService: UsersService

  beforeEach(
    async (): Promise<void> => {
      bcryptCompare = jest.fn().mockReturnValue(true)
      ;(bcrypt.compare as jest.Mock) = bcryptCompare
      userData = copy(mockedUser)
      findOne = jest.fn().mockResolvedValue(userData)
      const userRepository = {
        findOne,
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
