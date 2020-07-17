import React, { ReactElement } from "react"
import styled from "styled-components"

import { AddFriendForm } from "./add-friend.form"
import { UsersListContent } from "./users-list-content"

import { User } from "../../utils/interfaces"
import { theme } from "../../style-guide/theme"

interface Props {
	users: User[] | undefined
	updateUsersList: (users?: User[] | null) => void
	handleUserSelect: (id?: number) => void
	isSearching: boolean
	setIsSearching: (isSearching: boolean) => void
}

const UsersBlockContainer = styled.div`
	width: 40%;
	border-right: 1px solid ${theme.colors.greys[1]};
`

const UsersListContainer = styled.div`
	margin-top: 0.4rem;
	border-top: 1px solid ${theme.colors.greys[1]};
	height: calc(100% - 61px);
	overflow-y: auto;
`

export const UsersList = ({
	users,
	updateUsersList,
	handleUserSelect,
	isSearching,
	setIsSearching,
}: Props): ReactElement => (
	<UsersBlockContainer>
		<AddFriendForm
			updateUsersList={updateUsersList}
			setIsSearching={setIsSearching}
		/>

		<UsersListContainer>
			<UsersListContent
				users={users}
				isSearching={isSearching}
				handleUserSelect={handleUserSelect}
			/>
		</UsersListContainer>
	</UsersBlockContainer>
)
