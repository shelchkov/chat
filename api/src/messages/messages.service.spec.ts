import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"

import { UsersService } from "../users/users.service"
import { SubscriptionsGateway } from "../subscriptions/subscriptions.gateway"
import User from "../users/user.entity"
import { copy, convertToArray } from "../utils/utils"
import mockedUser from "../utils/mocks/user"
import mockedMessages from "../utils/mocks/messages"
import mockedMessage from "../utils/mocks/message"
import { AuthenticationService } from "../authentication/authentication.service"
import mockedConfigService from "../utils/mocks/config.service"
import mockedJwtService from "../utils/mocks/jwt.service"

import { MessagesService } from "./messages.service"
import Message from "./message.entity"

describe("MessagesService", (): void => {
  let messagesService: MessagesService
  let subscriptionsGateway: SubscriptionsGateway
  let usersService: UsersService

  // User repository
  let findOne: jest.Mock
  let saveUser: jest.Mock

  // Message repository
  let find: jest.Mock
  let create: jest.Mock
  let save: jest.Mock

  beforeEach(
    async (): Promise<void> => {
      const userData = copy(mockedUser)
      findOne = jest.fn().mockResolvedValue(userData)
      saveUser = jest.fn().mockResolvedValue(true)
      const userRepository = { findOne, save: saveUser }

      const messagesList = copy(mockedMessages)
      const message = copy(mockedMessage)
      find = jest.fn().mockResolvedValue(messagesList)
      create = jest.fn().mockResolvedValue(message)
      save = jest.fn().mockResolvedValue(true)
      const messageRepository = { find, create, save }

      const module = await Test.createTestingModule({
        providers: [
          MessagesService,
          {
            provide: getRepositoryToken(Message),
            useValue: messageRepository,
          },
          UsersService,
          SubscriptionsGateway,
          { provide: getRepositoryToken(User), useValue: userRepository },
          { provide: ConfigService, useValue: mockedConfigService },
          { provide: JwtService, useValue: mockedJwtService },
          AuthenticationService,
        ],
      }).compile()

      messagesService = await module.get<MessagesService>(MessagesService)
      subscriptionsGateway = await module.get<SubscriptionsGateway>(
        SubscriptionsGateway,
      )
      usersService = await module.get<UsersService>(UsersService)
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

  describe("when sending message to user", (): void => {
    const text = "Hello"
    const fromName = "SenderName"
    const id = 2
    const userId = 1

    describe("and user is added to friends", (): void => {
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
        const sendMessageToUserSpy = jest.spyOn(
          subscriptionsGateway,
          "sendMessageToUser",
        )

        await messagesService.sendMessageToUser(id, userId, text, fromName)

        expect(sendMessageToUserSpy).toBeCalledTimes(1)
      })
    })

    describe("and user is not added to friends", (): void => {
      it("should add user to friends list", async (): Promise<void> => {
        const addFriendSpy = jest.spyOn(usersService, "addFriend")

        const result = await messagesService.sendMessageToUser(
          id + 2,
          userId,
          text,
          fromName,
        )

        expect(addFriendSpy).toBeCalledTimes(2)
        expect(result).toStrictEqual(mockedMessage)
      })
    })
  })
})
