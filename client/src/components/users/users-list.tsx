import React, { ReactElement } from "react"
import styled from "styled-components"

import { User, UserWithLatestMessage } from "../../utils/interfaces"
import { theme } from "../../style-guide/theme"

import { AddFriendForm } from "./add-friend.form"
import { UsersListContent } from "./users-list-content"

interface Props {
	users: UserWithLatestMessage[] | undefined
	isSearching: boolean
	typingUsers: number[]
	isMobile?: boolean
	selectedUserId?: number
	updateUsersList: (users?: User[] | null) => void
	handleUserSelect: (user?: User) => void
	setIsSearching: (isSearching: boolean) => void
}

const UsersBlockContainer = styled.section<{ isMobile?: boolean }>`
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

export const UsersList = ({
	users,
	isSearching,
	typingUsers,
	isMobile,
	selectedUserId,
	updateUsersList,
	handleUserSelect,
	setIsSearching,
}: Props): ReactElement => (
	<UsersBlockContainer isMobile={isMobile}>
		<AddFriendForm
			updateUsersList={updateUsersList}
			setIsSearching={setIsSearching}
		/>

		<UsersListContainer>
			<UsersListContent
				users={users}
				isSearching={isSearching}
				handleUserSelect={handleUserSelect}
				selectedUserId={selectedUserId}
				typingUsers={typingUsers}
			/>
		</UsersListContainer>
	</UsersBlockContainer>
)
