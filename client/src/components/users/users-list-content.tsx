import React, { ReactElement } from "react"
import styled from "styled-components"

import { User, UserWithLatestMessage } from "../../utils/interfaces"
import { splitUsers } from "../../utils/user-utils"

import { UserCard } from "./user-card"
import { Divider } from "./divider"

interface Props {
	users: UserWithLatestMessage[] | undefined
	isSearching: boolean
	selectedUserId: number | undefined
	typingUsers: number[]
	handleUserSelect: (user?: User) => void
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
	selectedUserId,
	typingUsers,
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

	const { friends, notFriends } = splitUsers(users)

	return (
		<>
			{friends.map(
				(user): ReactElement => (
					<UserCard
						user={user}
						key={user.id}
						isSelected={user.id === selectedUserId}
						isTyping={typingUsers.includes(user.id)}
						handleUserSelect={handleUserSelect}
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
