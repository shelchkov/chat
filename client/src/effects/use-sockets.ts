import { useEffect, useState } from "react"

import { socketUrl } from "../utils/api-utils"
import { Message } from "../utils/interfaces"

interface SocketsProps {
	data: Data | undefined
}

interface Data {
	newMessage?: Message
	online?: { userId: number }[]
	fromName?: string
}

const closeTimeout = 100

export const useSockets = (): SocketsProps => {
	const [connectionsNumber, setconnectionsNumber] = useState(1)
	const [data, setData] = useState()

	useEffect((): void => {
		if (!connectionsNumber) {
			return
		}

		const ws = new WebSocket(socketUrl)

		ws.onmessage = (event): void => {
			const data = JSON.parse(event.data)

			setData(data)
		}

		ws.onclose = (): void => {
			setTimeout(
				(): void => setconnectionsNumber(connectionsNumber + 1),
				closeTimeout * connectionsNumber,
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [connectionsNumber])

	useEffect((): void => {
		setconnectionsNumber(0)
	}, [])

	return { data }
}
