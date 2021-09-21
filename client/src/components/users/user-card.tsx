import React, { ReactElement } from "react"
import styled from "styled-components"

import { User } from "../../utils/interfaces"
import { theme } from "../../style-guide/theme"

interface Props {
	user: User
	handleUserSelect: (user?: User) => void
	shouldHideUserStatus?: boolean
	isSelected: boolean
}

const UserCardContainer = styled.div<{ isSelected: boolean }>`
	padding: 0.4rem 0.7rem;
	min-height: 24px;
	border-bottom: 1px solid ${theme.colors.greys[1]};
	background-color: ${(p): string =>
		p.isSelected ? theme.colors.greys[2] : "transparent"};
	cursor: pointer;

	&:hover {
		background-color: ${(p): string => p.isSelected ? theme.colors.greys[2] : theme.colors.greys[3]};
	}
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
	isSelected,
}: Props): ReactElement => {
	const handleClick = (): void => {
		handleUserSelect(user)
	}

	return (
		<UserCardContainer onClick={handleClick} isSelected={isSelected}>
			<UserNameContainer>
				{user.name}
				{!shouldHideUserStatus && (
					<UserStatus isOnline={user.isOnline} />
				)}
			</UserNameContainer>
		</UserCardContainer>
	)
}
