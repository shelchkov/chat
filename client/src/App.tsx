import React, { lazy, ReactElement, Suspense } from "react"

import { LoadingPage } from "./pages/loading.page"
import { useUser } from "./effects/use-user"

const ErrorPage = lazy(async () => ({
	default: (await import("./pages/error.page")).ErrorPage,
}))
const SignedOutPage = lazy(async () => ({
	default: (await import("./pages/signed-out.page")).SignedOutPage,
}))
const MainPage = lazy(async () => ({
	default: (await import("./pages/main.page")).MainPage,
}))

const App = (): ReactElement => {
	const { user, error, handleSignOut, setUser } = useUser()

	if (error) {
		return (
			<Suspense fallback={<LoadingPage />}>
				<ErrorPage />
			</Suspense>
		)
	}

	if (user === null) {
		return (
			<Suspense fallback={<LoadingPage />}>
				<SignedOutPage setUser={setUser} />
			</Suspense>
		)
	}

	if (user) {
		return (
			<Suspense fallback={<LoadingPage />}>
				<MainPage user={user} handleSignOut={handleSignOut} />
			</Suspense>
		)
	}

	return <LoadingPage />
}

export default App
