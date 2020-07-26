import React, { ReactElement, useEffect } from "react"
import styled from "styled-components"
import { useRequest } from "../../effects/use-request"

import { getSignOutInput } from "../../utils/api-utils"

interface Props {
	handleSignOut: () => void
}

const SignOutButton = styled.p`
	margin-right: 1rem;
	margin-left: 1rem;
	text-decoration: underline;
	cursor: pointer;
`

const signOutText = "Sign Out"

const getSignOutText = (isLoading: boolean, error?: string): string => {
	if (error) {
		return "Error"
	}

	return signOutText + (isLoading ? "..." : "")
}

export const SignOut = ({ handleSignOut }: Props): ReactElement => {
	const { start, data, error, isLoading } = useRequest(
		getSignOutInput(),
	)

	const handleClick = (): void => {
		start()
	}

	useEffect((): void => {
		data && data.success && handleSignOut()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	return (
		<SignOutButton onClick={handleClick}>
			{getSignOutText(isLoading, error)}
		</SignOutButton>
	)
}
