import React, { ReactElement } from "react"
import styled from "styled-components"

import { User } from "../../utils/interfaces"
import { theme } from "../../style-guide/theme"

interface Props {
	user: User
	handleUserSelect: (id?: number) => void
}

const UserCardContainer = styled.div`
	padding: 0.4rem 0.7rem;
	min-height: 24px;
	border-bottom: 1px solid ${theme.colors.greys[1]};
	cursor: pointer;
`

export const UserCard = ({
	user,
	handleUserSelect,
}: Props): ReactElement => {
	const handleClick = (): void => {
		handleUserSelect(user.id)
	}

	return (
		<UserCardContainer onClick={handleClick}>
			{user.name}
		</UserCardContainer>
	)
}
