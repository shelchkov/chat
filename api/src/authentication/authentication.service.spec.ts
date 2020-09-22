import { Test, TestingModule } from "@nestjs/testing"
import { AuthenticationService } from "./authentication.service"
import { UsersService } from "../users/users.service"
import { Repository } from "typeorm"
import User from "../users/user.entity"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"

describe("AuthenticationService", () => {
  const authenticationService = new AuthenticationService(
    new UsersService(new Repository<User>()),
    new JwtService({ secretOrPrivateKey: "Secret Key" }),
    new ConfigService()
  )

  describe("when creating a cookie", () => {
    it("should retrun a string", () => {
      const userId = 1

      expect(typeof authenticationService.getCookieWithJwtToken(userId)).toEqual("string")
    })
  })
})
