import { useEffect, useState } from "react"

import { getLatestMessagesInput } from "../utils/api-utils"
import { Message } from "../utils/interfaces"

import { useRequest } from "./use-request"

interface Result {
	latestMessages: Message[] | undefined
	updateLatestMessage: (message: Message) => void
}

const checkUsersPair = (
	message: Message,
	message2: Message,
): boolean => {
	const { from, to } = message
	const { from: from2, to: to2 } = message2

	return (
		(from === from2 && to === to2) || (from === to2 && to === from2)
	)
}

export const useLatestMessages = (): Result => {
	const { data, start } = useRequest(getLatestMessagesInput())
	const [latestMessages, setLatestMessages] = useState<Message[]>()

	const updateLatestMessage = (message: Message) => {
		if (!latestMessages) {
			return
		}

		setLatestMessages(
			latestMessages.map((latestMessage) =>
				checkUsersPair(message, latestMessage)
					? message
					: latestMessage,
			),
		)
	}

	useEffect(() => {
		if (data && !data.statusCode) {
			setLatestMessages(data)
		}
	}, [data])

	useEffect(start, [])

	return { latestMessages, updateLatestMessage }
}
