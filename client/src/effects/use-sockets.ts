import { useEffect, useRef, useState } from "react"

import { socketUrl } from "../utils/api-utils"
import { Message } from "../utils/interfaces"

interface SocketsProps {
	data: Data | undefined
	sendMessage: (
		event: string,
		data: { startTyping?: number; stopTyping?: number },
	) => void
}

interface Data {
	newMessage?: Message
	online?: { userId: number }[]
	fromName?: string
	newUserOnline?: number
	stopTyping?: number
	startTyping?: number
}

const closeTimeout = 100

export const useSockets = (): SocketsProps => {
	const [connectionsNumber, setconnectionsNumber] = useState(1)
	const [data, setData] = useState<Data>()
	const ws = useRef<WebSocket>()

	useEffect((): (() => void) | undefined => {
		if (!connectionsNumber) {
			return
		}

		ws.current = new WebSocket(socketUrl)

		ws.current.onmessage = (event): void =>
			setData(JSON.parse(event.data))

		let timer: number | null

		ws.current.onclose = (): void => {
			if (timer !== null) {
				timer = setTimeout(
					(): void => setconnectionsNumber(connectionsNumber + 1),
					closeTimeout * connectionsNumber,
				)
			}
		}

		return (): void => {
			ws.current && ws.current.close()

			if (timer) {
				return clearTimeout(timer)
			}

			timer = null
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [connectionsNumber])

	useEffect((): (() => void) => {
		return (): void => setconnectionsNumber(0)
	}, [])

	const sendMessage: SocketsProps["sendMessage"] = (event, data) => {
		ws.current && ws.current.send(JSON.stringify({ data, event }))
	}

	return { data, sendMessage }
}
