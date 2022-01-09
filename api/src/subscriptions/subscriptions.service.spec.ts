import { Test } from "@nestjs/testing"
import { AuthenticationService } from "../authentication/authentication.service"
import { SubscriptionsService } from "./subscriptions.service"

describe("SubscriptionsService", () => {
  let subscriptionsService: SubscriptionsService

  const getUserIdFromToken = jest.fn()

  beforeAll(async () => {
    const authenticationService = { getUserIdFromToken }

    const module = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: AuthenticationService, useValue: authenticationService },
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
