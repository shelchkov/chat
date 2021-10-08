import { User } from "../utils/interfaces"
import { markNotFriends } from "../utils/user-utils"
import { useArrayState } from "./use-array-state"

interface Result {
	friends: User[] | undefined
	addFriend: (friend: User) => void
	updateUsersList: (users?: User[] | null) => void
	addNewFriend: (userId: number) => void
}

export const useFriends = (userFriends: User[] = []): Result => {
	const [friends, setFriends, addFriend, resetFriends] = useArrayState(userFriends)
	const [originalFriends = [], _, addOriginalFriend] = useArrayState(userFriends)

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
		if (friends && !originalFriends.find(({ id }) => id === userId)) {
			const newFriend = friends.find(({ id }) => id === userId)
			newFriend && addOriginalFriend(newFriend)
		}
	}

	return { friends, addFriend, updateUsersList, addNewFriend }
}
