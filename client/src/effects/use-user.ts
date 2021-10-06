import { useEffect, useState } from "react"
import { getAuthenticateInput } from "../utils/api-utils"
import { User } from "../utils/interfaces"
import { useRequest } from "./use-request"

interface Result {
  user: User | null | undefined
  error: string | undefined
  handleSignOut: () => void
  setUser: (user?: User) => void
}

export const useUser = (): Result => {
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

  return { user, error, handleSignOut, setUser }
}
