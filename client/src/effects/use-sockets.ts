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
	newUserOnline?: number
}

const closeTimeout = 100

export const useSockets = (): SocketsProps => {
	const [connectionsNumber, setconnectionsNumber] = useState(1)
	const [data, setData] = useState()

	useEffect((): (() => void) | undefined => {
		if (!connectionsNumber) {
			return
		}

		const ws = new WebSocket(socketUrl)

		ws.onmessage = (event): void => {
			const data = JSON.parse(event.data)

			setData(data)
		}

		let timer: number | null

		ws.onclose = (): void => {
			if (timer === null) {
				return
			}

			timer = setTimeout(
				(): void => setconnectionsNumber(connectionsNumber + 1),
				closeTimeout * connectionsNumber,
			)
		}

		return (): void => {
			ws.close()

			if (timer) {
				clearTimeout(timer)
			} else {
				timer = null
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [connectionsNumber])

	useEffect((): (() => void) => {
		return (): void => {
			setconnectionsNumber(0)
		}
	}, [])

	return { data }
}
