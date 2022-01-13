import React, { ReactElement } from "react"
import styled from "styled-components"

import { User, UserWithLatestMessage } from "../../utils/interfaces"
import { theme } from "../../style-guide/theme"

import { LatestMessage } from "./latest-message"

interface Props {
	user: UserWithLatestMessage
	isSelected: boolean
	shouldHideUserStatus?: boolean
	isTyping?: boolean
	handleUserSelect: (user?: User) => void
}

const UserCardContainer = styled.div<{ isSelected: boolean }>`
	padding: 0.4rem 0.7rem;
	min-height: 24px;
	border-bottom: 1px solid ${theme.colors.greys[1]};
	background-color: ${(p): string =>
		p.isSelected ? theme.colors.greys[2] : "transparent"};
	cursor: pointer;

	&:hover {
		background-color: ${(p): string =>
			p.isSelected ? theme.colors.greys[2] : theme.colors.greys[3]};
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

const MessageContainer = styled.div`
	padding-top: 4px;
`

export const UserCard = ({
	user,
	isSelected,
	shouldHideUserStatus,
	isTyping,
	handleUserSelect,
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

			<MessageContainer>
				{isTyping ? (
					"Typing..."
				) : (
					<LatestMessage
						latestMessage={user.latestMessage}
						userId={user.id}
					/>
				)}
			</MessageContainer>
		</UserCardContainer>
	)
}
