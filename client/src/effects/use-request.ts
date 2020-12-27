import { useState } from "react"

import { RequestMethod } from "../utils/enums"
import { apiUrl } from "../utils/utils"

interface Request {
	data?: any
	error?: string
	isLoading: boolean
	start: (body?: any, urlAddon?: string) => void
	resetData: () => void
}

interface Props {
	url: string
	body?: any
	method?: RequestMethod
}

export const useRequest = ({ url, body, method }: Props): Request => {
	const [isLoading, setIsLoading] = useState(false)
	const [data, setData] = useState<any>()
	const [error, setError] = useState<string>()

	const start = (newBody?: any, urlAddon?: string): void => {
		if (isLoading) {
			return
		}

		setIsLoading(true)

		fetch(url + (urlAddon || ""), {
			method: method || RequestMethod.GET,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": apiUrl,
			},
			body: JSON.stringify(newBody || body),
			credentials: "include",
		})
			.then((data) => data.json())
			.then((data): void => {
				setData(data)
				setIsLoading(false)
			})
			.catch((error): void => {
				setIsLoading(false)
				console.log(error)
				setError(error.message)
			})
	}

	const resetData = (): void => {
		setData(undefined)
	}

	return { data, error, isLoading, start, resetData }
}
