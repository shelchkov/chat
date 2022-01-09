import { debounce, throttle } from "../utils/utils"

interface Result {
	handleChange: () => void
}

const stopTypingDelay = 3000
const throttleDelay = 2900

export const useTyping = (
	handleTyping: (receiverId: number, isStopping?: boolean) => void,
	selectedUserId?: number,
): Result => {
	const stopTyping = debounce(() => {
		selectedUserId && handleTyping(selectedUserId, true)
	}, stopTypingDelay)

	const handleChange = throttle(() => {
		if (!selectedUserId) {
			return
		}

		handleTyping(selectedUserId)
		stopTyping()
	}, throttleDelay)

	return { handleChange }
}
