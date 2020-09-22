import { UsersService } from "./users.service"
import { Test } from "@nestjs/testing"
import { getRepositoryToken } from "@nestjs/typeorm"
import User from "./user.entity"

describe("UsersService", (): void => {
  let usersService: UsersService
  let findOne: jest.Mock

  beforeEach(
    async (): Promise<void> => {
      findOne = jest.fn()
      const module = await Test.createTestingModule({
        providers: [
          UsersService,
          { provide: getRepositoryToken(User), useValue: { findOne } },
        ],
      }).compile()

      usersService = await module.get(UsersService)
    },
  )

  describe("when getting a user by email", (): void => {
    describe("and the user is matched", (): void => {
      let user: User

      beforeEach((): void => {
        user = new User()
        findOne.mockReturnValue(Promise.resolve(user))
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
})
