import { useEffect, useState } from "react"

import { Message, User } from "../utils/interfaces"
import { createFriend } from "../utils/user-utils"

import { useSockets } from "./use-sockets"

interface Result {
	newMessage: Message | undefined
}

export const useUserSockets = (
	friends: User[] | undefined,
	addNewFriend: (friend: User) => void,
	addNewOnlineFriend: (friendId: number) => void,
	setOnlineFriends: (friends: number[]) => void,
): Result => {
	const { data } = useSockets()
	const [newMessage, setNewMessage] = useState<Message>()

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	return { newMessage }
}
