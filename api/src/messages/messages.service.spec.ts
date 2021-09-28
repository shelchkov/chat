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
import LatestMessage from "./latest-message.entity"
import mockedLatestMessage from "../utils/mocks/latestMessage"

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
  const latestMessage = copy(mockedLatestMessage)

  // Latest Message repository
  const latestCreate = jest.fn().mockReturnValue(latestMessage)
  const latestSave = jest.fn()
  const latestUpdate = jest.fn()
  const latestGetOne = jest.fn()
  const latestGetMany = jest.fn().mockResolvedValue([])

  beforeAll(async (): Promise<void> => {
    const messageRepository = { find, create, save }
    const usersService = { addFriend, getUsersFriend }
    const subscriptionsGateway = { sendMessageToUser }
    const latestCreateQueryBuilder = jest.fn().mockReturnValue({
      where: () => ({
        getOne: latestGetOne,
        leftJoinAndSelect: () => ({ getMany: latestGetMany }),
      }),
    })
    const latestMessageRepository = {
      create: latestCreate,
      save: latestSave,
      update: latestUpdate,
      createQueryBuilder: latestCreateQueryBuilder,
    }

    const module = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(Message),
          useValue: messageRepository,
        },
        {
          provide: getRepositoryToken(LatestMessage),
          useValue: latestMessageRepository,
        },
        { provide: UsersService, useValue: usersService },
        { provide: SubscriptionsGateway, useValue: subscriptionsGateway },
      ],
    }).compile()

    messagesService = await module.get<MessagesService>(MessagesService)
  })

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
      beforeAll(() => {
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
        getUsersFriend.mockResolvedValue(userData.friends[0])
      })

      afterAll(() => {
        getUsersFriend.mockReset()
      })

      it("should create new message", async (): Promise<void> => {
        const result = await messagesService.sendMessageToUser(
          id,
          userId,
          text,
          fromName,
        )

        expect(result).toEqual(mockedMessage)
      })

      it("should call subscriptions module", async (): Promise<void> => {
        await messagesService.sendMessageToUser(id, userId, text, fromName)

        expect(sendMessageToUser).toBeCalledTimes(1)
      })

      it("updates latest message", async () => {
        latestCreate.mockClear()
        latestSave.mockClear()
        await messagesService.sendMessageToUser(id, userId, text, fromName)

        expect(latestCreate).toBeCalledTimes(1)
        expect(latestSave).toBeCalledTimes(1)
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

    describe("and latest message exists", () => {
      beforeAll(() => {
        latestGetOne.mockResolvedValue([latestMessage])
      })

      it("updates latest message", async () => {
        latestUpdate.mockClear()
        await messagesService.sendMessageToUser(id, userId, text, fromName)

        expect(latestUpdate).toBeCalledTimes(1)
      })
    })
  })

  describe("when getting latest messages", () => {
    const userId = 1

    it("searches repository", async () => {
      await messagesService.getLatestMessages(userId)

      expect(latestGetMany).toBeCalledTimes(1)
    })

    describe("and messages are found", () => {
      beforeAll(() => {
        latestGetMany.mockResolvedValue([latestMessage])
      })

      it("returns list of messages", async () => {
        expect(await messagesService.getLatestMessages(userId)).toEqual([
          latestMessage.message,
        ])
      })
    })
  })
})
