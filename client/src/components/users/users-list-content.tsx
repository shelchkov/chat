import React, { ReactElement } from "react"
import styled from "styled-components"

import { UserCard } from "./user-card"

import { User } from "../../utils/interfaces"

interface Props {
	users: User[] | undefined
	isSearching: boolean
	handleUserSelect: (id?: number) => void
}

const NoUsersContainer = styled.div`
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`

const noUsersText = "Add users by searching above."
const searchingText = "Searching..."
const nothingFoundText = "Nothing was found"
const errorText = "Something went wrong"

export const UsersListContent = ({
	users,
	isSearching,
	handleUserSelect,
}: Props): ReactElement => {
	if (!users) {
		return (
			<NoUsersContainer>
				{isSearching ? searchingText : errorText}
			</NoUsersContainer>
		)
	}

	if (users.length === 0) {
		return (
			<NoUsersContainer>
				{isSearching ? nothingFoundText : noUsersText}
			</NoUsersContainer>
		)
	}

	return (
		<>
			{users.map(
				(user): ReactElement => (
					<UserCard
						user={user}
						key={user.id}
						handleUserSelect={handleUserSelect}
						shouldHideUserStatus={isSearching}
					/>
				),
			)}
		</>
	)
}
