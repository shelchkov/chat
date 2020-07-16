import React, { ReactElement } from "react"
import styled from "styled-components"

import { AddFriendForm } from "./add-friend.form"
import { UsersListContent } from "./users-list-content"

import { User } from "../../utils/interfaces"
import { theme } from "../../style-guide/theme"

interface Props {
	users: User[] | undefined
	updateUsersList: (users?: User[] | null) => void
	isLoading: boolean
	handleUserSelect: (id: number) => void
	isSearching: boolean
	setIsSearching: (isSearching: boolean) => void
}

const UsersBlockContainer = styled.div`
	width: 40%;
	border-right: 1px solid ${theme.colors.greys[1]};
`

const UsersListContainer = styled.div`
	height: 100%;
	margin-top: 0.4rem;
	border-top: 1px solid ${theme.colors.greys[1]};
`

export const UsersList = ({
	users,
	updateUsersList,
	isLoading,
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
				isLoading={isLoading}
				handleUserSelect={handleUserSelect}
			/>
		</UsersListContainer>
	</UsersBlockContainer>
)
