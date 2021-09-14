import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"

import { UsersService } from "../users/users.service"
import { SubscriptionsGateway } from "../subscriptions/subscriptions.gateway"
import { copy, convertToArray } from "../utils/utils"
import mockedUser from "../utils/mocks/user"
import mockedMessages from "../utils/mocks/messages"
import mockedMessage from "../utils/mocks/message"

import { MessagesService } from "./messages.service"
import Message from "./message.entity"

describe("MessagesService", (): void => {
  let messagesService: MessagesService

  // Message repository
  const messagesList = copy(mockedMessages)
  const message = copy(mockedMessage)
  const find = jest.fn().mockResolvedValue(messagesList)
  const create = jest.fn().mockResolvedValue(message)
  const save = jest.fn().mockResolvedValue(true)

  // Users service
  const addFriend = jest.fn().mockResolvedValue(undefined)
  const getUsersFriend = jest.fn().mockResolvedValue(undefined)

  // Subscriptions Gateway
  const sendMessageToUser = jest.fn().mockResolvedValue(undefined)

  const userData = copy(mockedUser)

  beforeAll(
    async (): Promise<void> => {
      const messageRepository = { find, create, save }
      const usersService = { addFriend, getUsersFriend }
      const subscriptionsGateway = { sendMessageToUser }

      const module = await Test.createTestingModule({
        providers: [
          MessagesService,
          {
            provide: getRepositoryToken(Message),
            useValue: messageRepository,
          },
          { provide: UsersService, useValue: usersService },
          { provide: SubscriptionsGateway, useValue: subscriptionsGateway },
        ],
      }).compile()

      messagesService = await module.get<MessagesService>(MessagesService)
    },
  )

  describe("when getting user's messages", (): void => {
    const id = 2
    const userId = 1

    describe("and user is not a friend", (): void => {
      it("should throw an error", async (): Promise<void> => {
        await expect(
          messagesService.getMessagesFromUser(id + 1, userId),
        ).rejects.toThrow()
      })
    })

    describe("and user is a friend", (): void => {
      beforeEach(() => {
        getUsersFriend.mockResolvedValue(userData.friends[0])
      })

      afterAll(() => {
        getUsersFriend.mockReset()
      })

      it("should return list of messages", async (): Promise<void> => {
        const result = await messagesService.getMessagesFromUser(id, userId)

        expect(convertToArray(result)).toStrictEqual(mockedMessages)
      })
    })
  })

  describe("when sending message to user", (): void => {
    const text = "Hello"
    const fromName = "SenderName"
    const id = 2
    const userId = 1

    describe("and user is added to friends", (): void => {
      beforeEach(() => {
        sendMessageToUser.mockClear()
      })

      it("should create new message", async (): Promise<void> => {
        const result = await messagesService.sendMessageToUser(
          id,
          userId,
          text,
          fromName,
        )

        expect(result).toStrictEqual(mockedMessage)
      })

      it("should call subscriptions module", async (): Promise<void> => {
        await messagesService.sendMessageToUser(id, userId, text, fromName)

        expect(sendMessageToUser).toBeCalledTimes(1)
      })
    })

    describe("and user is not added to friends", (): void => {
      beforeEach(() => {
        addFriend.mockClear()
      })

      it("should add user to friends list", async (): Promise<void> => {
        const result = await messagesService.sendMessageToUser(
          id + 2,
          userId,
          text,
          fromName,
        )

        expect(addFriend).toBeCalledTimes(2)
        expect(result).toStrictEqual(mockedMessage)
      })
    })
  })
})
