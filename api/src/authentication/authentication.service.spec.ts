import { Test } from "@nestjs/testing"
import { AuthenticationService } from "./authentication.service"
import { UsersService } from "../users/users.service"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import User from "../users/user.entity"
import { getRepositoryToken } from "@nestjs/typeorm"
import mockedConfigService from "../utils/mocks/config.service"
import mockedJwtService from "../utils/mocks/jwt.service"

describe("AuthenticationService", () => {
  let authenticationService: AuthenticationService

  beforeEach(
    async (): Promise<void> => {
      const module = await Test.createTestingModule({
        providers: [
          AuthenticationService,
          UsersService,
          { provide: ConfigService, useValue: mockedConfigService },
          { provide: JwtService, useValue: mockedJwtService },
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
