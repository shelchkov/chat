import React, { ReactElement, useEffect } from "react"
import styled from "styled-components"
import { useRequest } from "../../effects/use-request"

import { getSignOutInput } from "../../utils/api-utils"
import { theme } from "../../style-guide/theme"

interface Props {
	handleSignOut: () => void
}

const SignOutButton = styled.p`
	margin-right: 0.5rem;
	margin-left: 1rem;
	min-width: 63px;
	text-decoration: underline;
	cursor: pointer;

	@media (min-width: ${theme.breakpoints[1]}) {
		margin-right: 1rem;
	}
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
