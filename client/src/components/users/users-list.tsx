import React, { ReactElement, useState } from "react"
import styled from "styled-components"

import { AddFriendForm } from "./add-friend.form"
import { UsersListContent } from "./users-list-content"

import { User } from "../../utils/interfaces"
import { theme } from "../../style-guide/theme"

interface Props {
	users?: User[]
	updateUsersList: (users?: User[] | null) => void
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
}: Props): ReactElement => {
	const [isSearching, setIsSearching] = useState(false)

	return (
		<UsersBlockContainer>
			<AddFriendForm
				updateUsersList={updateUsersList}
				setIsSearching={setIsSearching}
			/>

			<UsersListContainer>
				<UsersListContent users={users} isSearching={isSearching} />
			</UsersListContainer>
		</UsersBlockContainer>
	)
}
