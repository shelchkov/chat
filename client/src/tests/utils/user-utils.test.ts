import { Message, User } from "../../utils/interfaces"
import {
	addLatestMessagesToUsers,
	findFriend,
	getNewOriginalFriend,
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

		it("users are optional", () => {
			expect(markOnlineUsers()).toEqual(undefined)
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
					text: message.text + "2",
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
					text: message.text + "3",
					id: message.id + 2,
				},
			]
			const result = getUpdatedLatestMessages(message, messages)
			expect(result?.length).toEqual(1)
			expect((result || [])[0]).toEqual(message)
		})

		it("messages are optional", () => {
			expect(getUpdatedLatestMessages(message)).toEqual(undefined)
		})

		it("adds new message", () => {
			const messages: Message[] = [
				{
					from: message.from,
					to: message.to + 1,
					id: message.id + 3,
					text: "message",
				},
			]
			const result = getUpdatedLatestMessages(message, messages)

			expect(result?.length).toEqual(messages.length + 1)
			expect((result || [])[1]).toEqual(message)
		})
	})

	describe("findFriend function", () => {
		const user: User = { ...userMock, friends: [userMock2] }

		it("finds friend", () => {
			expect(findFriend(user, (user.friends || [])[0].id)).toEqual(
				(user.friends || [])[0],
			)
		})
	})

	describe("getNewOriginalFriend function", () => {
		const userId = 4
		const friends = [{ ...userMock, id: userId }]

		it("handles case when original friends already have user", () => {
			expect(getNewOriginalFriend(userId, [], friends)).toEqual(
				undefined,
			)
		})

		it("finds user with desired id", () => {
			expect(getNewOriginalFriend(userId, friends, [])).toEqual(
				friends[0],
			)
		})
	})
})
