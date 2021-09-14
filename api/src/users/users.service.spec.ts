import { UsersService } from "./users.service"
import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import User from "./user.entity"
import { CreateUserDto } from "./dto/createUser.dto"
import { removePasswords } from "../utils/utils"

describe("UsersService", (): void => {
  let usersService: UsersService

  const findOne = jest.fn()
  const create = jest.fn()
  const find = jest.fn()
  const save = jest.fn()

  beforeAll(
    async (): Promise<void> => {
      const usersRepository = { findOne, create, find, save }

      const module = await Test.createTestingModule({
        providers: [
          UsersService,
          {
            provide: getRepositoryToken(User),
            useValue: usersRepository,
          },
        ],
      }).compile()

      usersService = await module.get(UsersService)
    },
  )

  describe("when getting a user by email", (): void => {
    describe("and the user is matched", (): void => {
      const user = new User()

      beforeEach((): void => {
        findOne.mockResolvedValue(user)
      })

      it("should return the user", async (): Promise<void> => {
        const fetchedUser = await usersService.getByEmail("test@test.com")

        expect(fetchedUser).toEqual(user)
      })
    })

    describe("and the user is not matched", (): void => {
      beforeEach((): void => {
        findOne.mockReturnValue(undefined)
      })

      it("should throw an error", async (): Promise<void> => {
        await expect(
          usersService.getByEmail("test@test.com"),
        ).rejects.toThrow()
      })
    })
  })

  describe("when creating a new user", (): void => {
    const user = new User()
    const data = new CreateUserDto()

    beforeEach(() => {
      create.mockResolvedValue(user)
    })

    it("should return new user", async (): Promise<void> => {
      const createdUser = await usersService.create(data)

      expect(createdUser).toEqual(user)
    })
  })

  describe("when getting user by id", (): void => {
    const user = new User()
    const userId = 1

    describe("and user is not found", (): void => {
      beforeEach((): void => {
        findOne.mockResolvedValue(undefined)
      })

      it("should return found user", async (): Promise<void> => {
        await expect(usersService.getById(userId)).rejects.toThrow()
      })
    })

    describe("and user is found", (): void => {
      beforeEach((): void => {
        findOne.mockResolvedValue(user)
      })

      it("returns the user", async (): Promise<void> => {
        const foundUser = await usersService.getById(userId)

        expect(foundUser).toEqual(user)
      })
    })
  })

  describe("searching users by name", (): void => {
    const query = "query"
    const userId = 1
    const user = new User()
    user.password = "password"
    const users = [user]

    beforeEach((): void => {
      find.mockResolvedValue(users)
    })

    it("should return found users", async (): Promise<void> => {
      const foundUsers = await usersService.searchUsers(query, userId)

      expect(foundUsers).toHaveLength(users.length)
      expect(foundUsers).toStrictEqual(removePasswords(users))
    })

    it("returned users shouldn't have passwords", async (): Promise<
      void
    > => {
      const foundUsers = await usersService.searchUsers(query, userId)

      foundUsers.forEach((user): void => {
        expect(user.password).not.toBeDefined()
      })
    })
  })

  describe("adding new friend", (): void => {
    const userId = 1

    describe("and user id match friend id", (): void => {
      it("should throw an error", async (): Promise<void> => {
        await expect(
          usersService.addFriend(userId, userId),
        ).rejects.toThrow()
      })
    })

    describe("and that friend was already added to friend's list", (): void => {
      const friendId = userId + 1

      beforeEach((): void => {
        const user = new User()
        const friend = new User()
        friend.id = friendId
        user.friends = [friend]
        findOne.mockResolvedValue(user)
      })

      it("should throw an error", async (): Promise<void> => {
        await expect(
          usersService.addFriend(userId, friendId),
        ).rejects.toThrow()
      })
    })

    describe("and that friend wasn't added yet", (): void => {
      const friendId = userId + 1
      const user = new User()
      user.friends = []

      beforeEach((): void => {
        findOne.mockResolvedValue(user)
      })

      it("should return user with new friend", async (): Promise<void> => {
        const newUser = await usersService.addFriend(userId, friendId)

        expect(newUser.friends.length).toEqual(
          (user.friends || []).length + 1,
        )
      })
    })
  })

  describe("getting user's friend", (): void => {
    const userId = 1
    const friendId = userId + 1

    describe("and user doesn't have a frined with that id", (): void => {
      beforeEach((): void => {
        const user = new User()
        user.friends = []
        findOne.mockResolvedValue(user)
      })

      it("should return undefined", async (): Promise<void> => {
        const foundFriend = await usersService.getUsersFriend(
          userId,
          friendId,
        )
        expect(foundFriend).not.toBeDefined()
      })
    })

    describe("and user has a friend with provided id", (): void => {
      const user = new User()
      const friend = new User()
      friend.id = friendId
      user.friends = [friend]

      beforeEach((): void => {
        findOne.mockResolvedValue(user)
      })

      it("should return friend", async (): Promise<void> => {
        const foundFriend = await usersService.getUsersFriend(
          userId,
          friendId,
        )

        expect(foundFriend).toEqual(friend)
      })
    })
  })
})
