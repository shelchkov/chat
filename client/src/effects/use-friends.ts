import { useState } from "react"

import { User } from "../utils/interfaces"
import { markNotFriends } from "../utils/user-utils"

interface Result {
	friends: User[] | undefined
	onlineFriends: number[] | undefined
	addFriend: (friend: User) => void
	addNewOnlineFriend: (friendId: number) => void
	setOnlineFriends: (users: number[]) => void
	updateUsersList: (users?: User[] | null) => void
	addNewFriend: (userId: number) => void
}

export const useFriends = (userFriends: User[] = []): Result => {
	const [friends, setFriends] = useState<User[] | undefined>(
		userFriends,
	)
	const [onlineFriends, setOnlineFriends] = useState<number[]>()
	const [originalFriends, setOriginalFriends] = useState<User[]>(
		userFriends,
	)

	const addFriend = (friend: User) =>
		setFriends([...(friends || []), friend])
	const addNewOnlineFriend = (friendId: number) =>
		setOnlineFriends([...(onlineFriends || []), friendId])
	const resetFriends = () => setFriends(undefined)
	const addOriginalFriend = (friend: User): void =>
		setOriginalFriends([...(originalFriends || []), friend])

	const updateUsersList = (users?: User[] | null): void => {
		if (users) {
			return setFriends(markNotFriends(users, originalFriends))
		}

		if (users === null) {
			return resetFriends()
		}

		setFriends(originalFriends)
	}

	const addNewFriend = (userId: number): void => {
		if (
			friends &&
			!originalFriends.find((friend): boolean => friend.id === userId)
		) {
			const newFriend = friends.find(
				(friend): boolean => friend.id === userId,
			)

			newFriend && addOriginalFriend(newFriend)
		}
	}

	return {
		friends,
		onlineFriends,
		addFriend,
		addNewOnlineFriend,
		setOnlineFriends,
		updateUsersList,
		addNewFriend,
	}
}
