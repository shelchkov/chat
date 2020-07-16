import { useState } from "react"

import { RequestMethod } from "../utils/enums"

interface Request {
	data?: any
	error?: string
	isLoading: boolean
	start: (body?: any, urlAddon?: string) => void
}

interface Props {
	url: string
	body?: any
	method?: RequestMethod
}

export const useRequest = ({ url, body, method }: Props): Request => {
	const [isLoading, setIsLoading] = useState(false)
	const [data, setData] = useState()
	const [error, setError] = useState()

	const start = (newBody?: any, urlAddon?: string): void => {
		if (isLoading) {
			return
		}

		setIsLoading(true)

		fetch(url + (urlAddon || ""), {
			method: method || RequestMethod.GET,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(newBody || body),
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

	return { data, error, isLoading, start }
}