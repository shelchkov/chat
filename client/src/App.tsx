import React, { ReactElement } from "react"

import { SignedOutPage } from "./pages/signed-out.page"
import { MainPage } from "./pages/main.page"
import { LoadingPage } from "./pages/loading.page"
import { ErrorPage } from "./pages/error.page"

import { useUser } from "./effects/use-user"

const App = (): ReactElement => {
	const { user, error, handleSignOut, setUser } = useUser()

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
