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

export const splitUsers = (users: UserWithLatestMessage[]) =>
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
