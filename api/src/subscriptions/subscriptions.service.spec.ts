import { Test } from "@nestjs/testing"
import { UsersService } from "../users/users.service"
import mockedUser from "../utils/mocks/user"
import { copy } from "../utils/utils"
import { AuthenticationService } from "../authentication/authentication.service"
import { SubscriptionsService } from "./subscriptions.service"

describe("SubscriptionsService", () => {
  let subscriptionsService: SubscriptionsService

  const user = copy(mockedUser)

  const getUserIdFromToken = jest.fn()

  const getById = jest.fn().mockResolvedValue(user)

  beforeAll(async () => {
    const authenticationService = { getUserIdFromToken }
    const usersService = { getById }

    const module = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: AuthenticationService, useValue: authenticationService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile()

    subscriptionsService = await module.get<SubscriptionsService>(
      SubscriptionsService,
    )
  })

  describe("when handling error", () => {
    it("should send error and disconnect", () => {
      const client = { send: jest.fn(), disconnect: jest.fn() } as any

      subscriptionsService.sendErrorAndDisconnect(client)
      expect(client.send).toBeCalledTimes(1)
      expect(client.disconnect).toBeCalledTimes(1)
    })
  })
})
