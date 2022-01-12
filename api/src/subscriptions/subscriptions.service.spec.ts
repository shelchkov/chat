import { Test } from "@nestjs/testing"
import { UsersService } from "../users/users.service"
import mockedUser from "../utils/mocks/user"
import * as utils from "../utils/utils"
import { AuthenticationService } from "../authentication/authentication.service"
import { SubscriptionsService } from "./subscriptions.service"

jest.mock("../utils/utils", () => {
  const utils = jest.requireActual("../utils/utils")

  return {
    ...utils,
    getCookieParams: jest
      .fn()
      .mockReturnValue({ Authentication: "authenticationToken" }),
  }
})

const { copy } = utils

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

  const send = jest.fn()
  const disconnect = jest.fn()
  const client = { send, disconnect } as any

  describe("when handling connection", () => {
    const request = { headers: { cookie: "cookie" } } as any

    beforeEach(() => {
      send.mockClear()
      disconnect.mockClear()
    })

    describe("and user isn't authorized", () => {
      it("should send error and disconnect", () => {
        subscriptionsService.handleConnection(client, request)

        expect(getUserIdFromToken).toBeCalledTimes(1)
        expect(getUserIdFromToken).toBeCalledWith("authenticationToken")
        expect(client.send).toBeCalledTimes(1)
        expect(JSON.parse(client.send.mock.calls[0][0])).toHaveProperty(
          "error",
        )
        expect(client.disconnect).toBeCalledTimes(1)
      })
    })
  })
})
