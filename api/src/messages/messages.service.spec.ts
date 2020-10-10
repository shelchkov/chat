import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"

import { UsersService } from "../users/users.service"
import { SubscriptionsGateway } from "../subscriptions/subscriptions.gateway"
import User from "../users/user.entity"
import { copy } from "../utils/utils"
import mockedUser from "../utils/mocks/user"

import Message from "./message.entity"
import { MessagesService } from "./messages.service"

describe("MessagesService", (): void => {
  let messagesService: MessagesService

  let findOne: jest.Mock

  beforeEach(
    async (): Promise<void> => {
      const userData = copy(mockedUser)
      findOne = jest.fn().mockResolvedValue(userData)
      const userRepository = { findOne }

      const messageRepository = {}
      const subscriptionsGateway = {}

      const module = await Test.createTestingModule({
        providers: [
          MessagesService,
          {
            provide: getRepositoryToken(Message),
            useValue: messageRepository,
          },
          UsersService,
          { provide: SubscriptionsGateway, useValue: subscriptionsGateway },
          { provide: getRepositoryToken(User), useValue: userRepository },
        ],
      }).compile()

      messagesService = await module.get<MessagesService>(MessagesService)
    },
  )

  describe("when getting users messages", (): void => {
    const id = 2
    const userId = 1

    describe("and users is not a friend", (): void => {
      it("should throw an error", async (): Promise<void> => {
        await expect(
          messagesService.getMessagesFromUser(id + 1, userId),
        ).rejects.toThrow()
      })
    })
  })
})
