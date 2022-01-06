import { Message, User, UserWithLatestMessage } from "./interfaces"

export const markNotFriends = (
	users: User[],
	friends: User[],
): User[] =>
	users.map((user) =>
		friends.find((friend) => friend.id === user.id)
			? user
			: { ...user, notFriend: true },
	)

export const splitUsers = (
	users: UserWithLatestMessage[],
): {
	friends: UserWithLatestMessage[]
	notFriends: UserWithLatestMessage[]
} =>
	users.reduce(
		(acc, user) => {
			if (user.notFriend) {
				acc.notFriends.push(user)
			} else {
				acc.friends.push(user)
			}

			return acc
		},
		{ friends: [], notFriends: [] } as {
			friends: UserWithLatestMessage[]
			notFriends: UserWithLatestMessage[]
		},
	)

const getUsersMessage = (
	{ id }: User,
	messages: Message[],
): Message | undefined =>
	messages.find(({ from, to }) => [from, to].includes(id))

export const addLatestMessagesToUsers = (
	users?: User[],
	latestMessages?: Message[],
): UserWithLatestMessage[] | undefined => {
	if (!users || !latestMessages) {
		return users
	}

	return users.map((user) => ({
		...user,
		latestMessage: getUsersMessage(user, latestMessages),
	}))
}

export const markOnlineUsers = (
	users?: UserWithLatestMessage[],
	onlineFriends?: number[],
): UserWithLatestMessage[] | undefined => {
	if (!users) {
		return
	}

	if (onlineFriends) {
		return users.map(
			(user): User =>
				onlineFriends.includes(user.id)
					? { ...user, isOnline: true }
					: { ...user, isOnline: false },
		)
	}

	return users
}

const checkUsersPair = (
	{ from, to }: Message,
	{ from: from2, to: to2 }: Message,
): boolean =>
	(from === from2 && to === to2) || (from === to2 && to === from2)

export const getUpdatedLatestMessages = (
	message: Message,
	messages?: Message[],
): Message[] | undefined => {
	if (!messages) {
		return
	}

	let isFound = false

	const newMessages = messages.map((latestMessage) => {
		if (checkUsersPair(message, latestMessage)) {
			isFound = true

			return message
		}

		return latestMessage
	})

	return isFound ? newMessages : [...newMessages, message]
}

export const findFriend = (
	user: User | undefined,
	friendId: number,
): User | undefined =>
	user?.friends?.find((friend): boolean => friend.id === friendId)

export const createFriend = (
	id: number,
	name?: string,
	isOnline?: boolean,
): User => ({ id, name: name || "", isOnline, email: "" })

export const getNewOriginalFriend = (
	userId: number,
	friends?: User[],
	originalFriends?: User[],
): User | undefined => {
	if (
		!friends ||
		!originalFriends ||
		originalFriends.find(({ id }) => id === userId)
	) {
		return
	}

	return friends.find(({ id }) => id === userId)
}

export const getUsersList = (
	originalFriends: User[],
	users?: User[] | null,
): User[] | undefined => {
	if (users) {
		return markNotFriends(users, originalFriends)
	}

	if (users === null) {
		return undefined
	}

	return originalFriends
}
