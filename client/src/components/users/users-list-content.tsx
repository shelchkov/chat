import React, { ReactElement } from "react"
import styled from "styled-components"

import { User } from "../../utils/interfaces"
import { splitUsers } from "../../utils/utils"

import { UserCard } from "./user-card"
import { Divider } from "./divider"

interface Props {
	users: User[] | undefined
	isSearching: boolean
	handleUserSelect: (user?: User) => void
	selectedUserId: number | undefined
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
	selectedUserId,
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

	const { friends, notFriends } = splitUsers(users)

	return (
		<>
			{friends.map(
				(user): ReactElement => (
					<UserCard
						user={user}
						key={user.id}
						handleUserSelect={handleUserSelect}
						isSelected={user.id === selectedUserId}
					/>
				),
			)}

			{notFriends.length > 0 && <Divider />}

			{notFriends.map(
				(user): ReactElement => (
					<UserCard
						user={user}
						key={user.id}
						handleUserSelect={handleUserSelect}
						shouldHideUserStatus={isSearching}
						isSelected={user.id === selectedUserId}
					/>
				),
			)}
		</>
	)
}
