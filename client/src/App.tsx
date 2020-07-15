import React, { ReactElement, useState, useEffect } from "react"
import { useRequest } from "./effects/use-request"

import { SignedOutPage } from "./pages/signed-out.page"
import { MainPage } from "./pages/main.page"
import { LoadingPage } from "./pages/loading.page"
import { ErrorPage } from "./pages/error.page"

import { getAuthenticateInput } from "./utils/api-utils"

const App = (): ReactElement => {
	const { data, start, error } = useRequest(getAuthenticateInput())
	const [user, setUser] = useState<any>()

	useEffect((): void => {
		if (data && data.statusCode === 401) {
			setUser(null)

			return
		}

		console.log(data)
	}, [data])

	useEffect(start, [])

	if (error) {
		return <ErrorPage />
	}

	if (user === null) {
		return <SignedOutPage setUser={setUser} />
	}

	if (user) {
		return <MainPage />
	}

	return <LoadingPage />
}

export default App
