import { useState } from "react"

import { apiUrl, RequestInput } from "../utils/api-utils"
import { RequestMethod } from "../utils/enums"

interface Request {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	data?: any
	error?: string
	isLoading: boolean
	start: (body?: RequestInput["body"], urlAddon?: string) => void
	resetData: () => void
}

interface Props {
	url: string
	body?: RequestInput["body"]
	method?: RequestMethod
}

export const useRequest = ({ url, body, method }: Props): Request => {
	const [isLoading, setIsLoading] = useState(false)
	const [data, setData] = useState<Request["data"]>()
	const [error, setError] = useState<string>()

	const start = (
		newBody?: RequestInput["body"],
		urlAddon?: string,
	): void => {
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
