import { useEffect, useState } from "react"

import { getLatestMessagesInput } from "../utils/api-utils"
import { Message } from "../utils/interfaces"
import { getUpdatedLatestMessages } from "../utils/user-utils"

import { useRequest } from "./use-request"

interface Result {
	latestMessages: Message[] | undefined
	updateLatestMessage: (message: Message) => void
}

export const useLatestMessages = (): Result => {
	const { data, start } = useRequest(getLatestMessagesInput())
	const [latestMessages, setLatestMessages] = useState<Message[]>()

	const updateLatestMessage = (message: Message) => {
		setLatestMessages(getUpdatedLatestMessages(message, latestMessages))
	}

	useEffect(() => {
		if (data && !data.statusCode) {
			setLatestMessages(data)
		}
	}, [data])

	useEffect(start, [])

	return { latestMessages, updateLatestMessage }
}
