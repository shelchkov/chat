import { User } from "../utils/interfaces"
import { getNewOriginalFriend, getUsersList } from "../utils/user-utils"

import { useArrayState } from "./use-array-state"

interface Result {
	friends: User[] | undefined
	addFriend: (friend: User) => void
	updateUsersList: (users?: User[] | null) => void
	addNewFriend: (userId: number) => void
}

export const useFriends = (userFriends: User[] = []): Result => {
	const [friends, setFriends, addFriend] = useArrayState(userFriends)
	const [originalFriends = [], _, addOriginalFriend] = useArrayState(
		userFriends,
	)

	const updateUsersList = (users?: User[] | null): void => {
		setFriends(getUsersList(originalFriends, users))
	}

	const addNewFriend = (userId: number): void => {
		const newFriend = getNewOriginalFriend(
			userId,
			friends,
			originalFriends,
		)
		newFriend && addOriginalFriend(newFriend)
	}

	return { friends, addFriend, updateUsersList, addNewFriend }
}
