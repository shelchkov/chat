import React, { ReactElement } from "react"
import styled from "styled-components"

import { User } from "../../utils/interfaces"
import { theme } from "../../style-guide/theme"

import { AddFriendForm } from "./add-friend.form"
import { UsersListContent } from "./users-list-content"

interface Props {
	users: User[] | undefined
	updateUsersList: (users?: User[] | null) => void
	handleUserSelect: (user?: User) => void
	isSearching: boolean
	setIsSearching: (isSearching: boolean) => void
	onlineFriends?: number[]
	isMobile?: boolean
	selectedUserId?: number
}

const UsersBlockContainer = styled.div<{ isMobile?: boolean }>`
	width: ${(p): string => (p.isMobile ? "100%" : "40%")};
	border-right: ${(p): string =>
		p.isMobile ? "none" : `1px solid ${theme.colors.greys[1]}`};
`

const UsersListContainer = styled.div`
	margin-top: 0.4rem;
	border-top: 1px solid ${theme.colors.greys[1]};
	height: calc(100% - 61px);
	overflow-y: auto;
`

const formatUsers = (
	users?: User[],
	onlineFriends?: number[],
): User[] | undefined => {
	if (!users) {
		return
	}

	if (onlineFriends) {
		return users.map(
			(user): User =>
				onlineFriends.includes(user.id)
					? { ...user, isOnline: true }
					: { ...user, isOnline: false },
		)
	}

	return users
}

export const UsersList = ({
	users,
	updateUsersList,
	handleUserSelect,
	isSearching,
	setIsSearching,
	onlineFriends,
	isMobile,
	selectedUserId,
}: Props): ReactElement => (
	<UsersBlockContainer isMobile={isMobile}>
		<AddFriendForm
			updateUsersList={updateUsersList}
			setIsSearching={setIsSearching}
		/>

		<UsersListContainer>
			<UsersListContent
				users={formatUsers(users, onlineFriends)}
				isSearching={isSearching}
				handleUserSelect={handleUserSelect}
				selectedUserId={selectedUserId}
			/>
		</UsersListContainer>
	</UsersBlockContainer>
)
