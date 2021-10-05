import { Message, User } from "../../utils/interfaces"
import {
	addLatestMessagesToUsers,
	getUpdatedLatestMessages,
	markNotFriends,
	markOnlineUsers,
	splitUsers,
} from "../../utils/user-utils"
import { messageMock, userMock, userMock2 } from "../tests-utils"

describe("user-utils", () => {
	describe("markNotFriends function", () => {
		const users = [userMock, userMock2]
		const friends: User[] = []

		it("adds notFriend to users", () => {
			const result = markNotFriends(users, friends)

			result.forEach(({ notFriend }) => {
				expect(notFriend).toBeTruthy()
			})
		})

		it("doesn't add notFriend to friends", () => {
			const result = markNotFriends(users, [users[0]])

			expect(result[0]).not.toHaveProperty("notFriend")
			expect(result[1]).toHaveProperty("notFriend")
			expect(result[1].notFriend).toBeTruthy()
		})

		it("returns list of all supplied users", () => {
			const result = markNotFriends(users, friends)
			expect(result.length).toEqual(users.length)
		})
	})

	describe("splitUsers function", () => {
		const users: User[] = [{ ...userMock, notFriend: true }, userMock2]

		it("sorts users into friends and not friends", () => {
			const { friends, notFriends } = splitUsers(users)

			expect(friends[0].id).toEqual(users[1].id)
			expect(notFriends[0].id).toEqual(users[0].id)
		})

		it("sorts all users into two arrays", () => {
			const { friends, notFriends } = splitUsers(users)

			expect(friends.length).toEqual(1)
			expect(notFriends.length).toEqual(1)
		})
	})

	describe("addLatestMessagesToUsers function", () => {
		const users = [userMock, userMock2]
		const latestMessages = [messageMock]

		it("adds latest message to users", () => {
			const result = addLatestMessagesToUsers(users, latestMessages)
			expect(result).toBeDefined()
			expect(result?.length).toEqual(users.length)
			expect((result || [])[0].latestMessage).toEqual(latestMessages[0])
		})
	})

	describe("markOnlineUsers function", () => {
		const users = [userMock, userMock2]
		const onlineFriends = [userMock.id]

		it("sets users online status", () => {
			const result = markOnlineUsers(users, onlineFriends)
			expect(result).toBeDefined()
			expect(result?.length).toEqual(users.length)
			expect((result || [])[0]).toHaveProperty("isOnline", true)
			expect((result || [])[1]).toHaveProperty("isOnline", false)
		})
	})

	describe("getUpdatedLatestMessages function", () => {
		const message = messageMock
		const messages: Message[] = []

		it("updates latest messages list", () => {
			const result = getUpdatedLatestMessages(message, messages)
			expect(result?.length).toEqual(1)
			expect((result || [])[0]).toEqual(message)
		})

		it("replaces old message", () => {
			const messages: Message[] = [
				{
					from: message.from,
					to: message.to,
					text: message + "2",
					id: message.id + 1,
				},
			]
			const result = getUpdatedLatestMessages(message, messages)
			expect(result?.length).toEqual(1)
			expect((result || [])[0]).toEqual(message)
		})

		it("handles case when recipient and sender are switched", () => {
			const messages: Message[] = [
				{
					from: message.to,
					to: message.from,
					text: message + "3",
					id: message.id + 2,
				},
			]
			const result = getUpdatedLatestMessages(message, messages)
			expect(result?.length).toEqual(1)
			expect((result || [])[0]).toEqual(message)
		})
	})
})
