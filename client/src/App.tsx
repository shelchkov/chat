import React, { ReactElement, useState, useEffect } from "react"
import { useRequest } from "./effects/use-request"

import { SignedOutPage } from "./pages/signed-out.page"
import { MainPage } from "./pages/main.page"
import { LoadingPage } from "./pages/loading.page"
import { ErrorPage } from "./pages/error.page"

import { getAuthenticateInput } from "./utils/api-utils"
import { User } from "./utils/interfaces"

const App = (): ReactElement => {
	const { data, start, error } = useRequest(getAuthenticateInput())
	const [user, setUser] = useState<User | null>()

	useEffect((): void => {
		if (!data) {
			return
		}

		if (data && data.statusCode) {
			setUser(null)

			return
		}

		setUser(data)
	}, [data])

	useEffect(start, [])

	const handleSignOut = (): void => {
		setUser(null)
	}

	if (error) {
		return <ErrorPage />
	}

	if (user === null) {
		return <SignedOutPage setUser={setUser} />
	}

	if (user) {
		return <MainPage user={user} handleSignOut={handleSignOut} />
	}

	return <LoadingPage />
}

export default App
