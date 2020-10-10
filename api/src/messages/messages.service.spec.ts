import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"

import { UsersService } from "../users/users.service"
import { SubscriptionsGateway } from "../subscriptions/subscriptions.gateway"
import User from "../users/user.entity"
import { copy, convertToArray } from "../utils/utils"
import mockedUser from "../utils/mocks/user"
import mockedMessages from "../utils/mocks/messages"

import Message from "./message.entity"
import { MessagesService } from "./messages.service"

describe("MessagesService", (): void => {
  let messagesService: MessagesService

  // User repository
  let findOne: jest.Mock

  // Message repository
  let find: jest.Mock

  beforeEach(
    async (): Promise<void> => {
      const userData = copy(mockedUser)
      findOne = jest.fn().mockResolvedValue(userData)
      const userRepository = { findOne }

      const messagesList = copy(mockedMessages)
      find = jest.fn().mockResolvedValue(messagesList)
      const messageRepository = { find }

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

    describe("and user is a friend", (): void => {
      it("should return list of messages", async (): Promise<void> => {
        const result = await messagesService.getMessagesFromUser(id, userId)

        expect(convertToArray(result)).toStrictEqual(mockedMessages)
      })
    })
  })
})
