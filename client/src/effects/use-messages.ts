import { useEffect, useState } from "react"

import { getUsersMessagesInput } from "../utils/api-utils"
import { Message, User } from "../utils/interfaces"
import { findFriend } from "../utils/user-utils"

import { useRequest } from "./use-request"

interface Result {
	messages: Message[] | undefined
	isLoading: boolean
	error?: string
	addNewMessage: (message: Message) => void
}

export const useMessages = (
	isSearching: boolean,
	user: User | undefined,
	selectedUser?: User,
): Result => {
	const { start, data, isLoading, error } = useRequest(
		getUsersMessagesInput(),
	)
	const [messages, setMessages] = useState<Message[]>()

	const resetMessages = () => setMessages(undefined)

	useEffect((): void => {
		resetMessages()

		if (selectedUser) {
			if (!isSearching || findFriend(user, selectedUser.id)) {
				start(undefined, `${selectedUser.id}`)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedUser])

	useEffect((): void => {
		if (!data) {
			return
		}

		if (data.statusCode) {
			return resetMessages()
		}

		setMessages(data)
	}, [data])

	const addNewMessage = (message: Message) =>
		setMessages([...(messages || []), message])

	return { messages, isLoading, error, addNewMessage }
}
