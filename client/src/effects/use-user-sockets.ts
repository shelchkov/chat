import { useEffect, useState } from "react"

import { Message, User } from "../utils/interfaces"

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
			const newMessage = data.newMessage
			setNewMessage(newMessage)

			if (
				!friends ||
				!friends.find(({ id }): boolean => id === newMessage.from)
			) {
				const newFriend = {
					id: newMessage.from,
					name: data.fromName,
					email: "",
					isOnline: true,
				} as User

				addNewFriend(newFriend)

				addNewOnlineFriend(newFriend.id)
			}
		}

		if (data.online) {
			setOnlineFriends(
				data.online.map(
					(onlineUser: { userId: number }): number => onlineUser.userId,
				),
			)
		}

		if (data.newUserOnline) {
			addNewOnlineFriend(data.newUserOnline)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	return { newMessage }
}
