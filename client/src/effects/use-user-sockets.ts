import { useEffect, useState } from "react"

import { Message, User } from "../utils/interfaces"
import { createFriend } from "../utils/user-utils"

import { useSockets } from "./use-sockets"

interface Result {
	newMessage: Message | undefined
	typingUsers: number[]
	handleTyping: (receiverId: number, isStopping?: boolean) => void
}

export const useUserSockets = (
	friends: User[] | undefined,
	addNewFriend: (friend: User) => void,
	addNewOnlineFriend: (friendId: number) => void,
	setOnlineFriends: (friends: number[]) => void,
): Result => {
	const { data, sendMessage } = useSockets()
	const [newMessage, setNewMessage] = useState<Message>()
	const [typingUsers, setTypingUsers] = useState<number[]>([])

	useEffect((): void => {
		if (!data) {
			return
		}

		if (data.newMessage) {
			const { from } = data.newMessage
			setNewMessage(data.newMessage)

			if (!friends || !friends.find(({ id }) => id === from)) {
				addNewFriend(createFriend(from, data.fromName, true))
				addNewOnlineFriend(from)
			}
		}

		if (data.online) {
			setOnlineFriends(data.online.map(({ userId }) => userId))
		}

		if (data.newUserOnline) {
			addNewOnlineFriend(data.newUserOnline)
		}

		if (data.startTyping) {
			setTypingUsers((users) =>
				users.includes(data.startTyping as number)
					? users
					: [...users, data.startTyping as number],
			)
		}

		if (data.stopTyping) {
			setTypingUsers((users) =>
				users.filter((user) => user !== data.stopTyping),
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const handleTyping = (receiverId: number, isStopping?: boolean) => {
		sendMessage("typing", {
			[isStopping ? "stopTyping" : "startTyping"]: receiverId,
		})
	}

	return { newMessage, typingUsers, handleTyping }
}
