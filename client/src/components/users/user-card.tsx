import React, { ReactElement } from "react"
import styled from "styled-components"

import { User } from "../../utils/interfaces"
import { theme } from "../../style-guide/theme"

interface Props {
	user: User
	handleUserSelect: (id?: number) => void
	shouldHideUserStatus?: boolean
}

const UserCardContainer = styled.div`
	padding: 0.4rem 0.7rem;
	min-height: 24px;
	border-bottom: 1px solid ${theme.colors.greys[1]};
	cursor: pointer;
`

const UserNameContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const UserStatus = styled.div<{ isOnline?: boolean }>`
	width: 7px;
	height: 7px;
	margin-right: 8px;
	background-color: ${(p): string =>
		p.isOnline ? theme.colors.greens[0] : theme.colors.greys[1]};
	border-radius: 50%;
`

export const UserCard = ({
	user,
	handleUserSelect,
	shouldHideUserStatus,
}: Props): ReactElement => {
	const handleClick = (): void => {
		handleUserSelect(user.id)
	}

	return (
		<UserCardContainer onClick={handleClick}>
			<UserNameContainer>
				{user.name}
				{!shouldHideUserStatus && (
					<UserStatus isOnline={user.isOnline} />
				)}
			</UserNameContainer>
		</UserCardContainer>
	)
}
