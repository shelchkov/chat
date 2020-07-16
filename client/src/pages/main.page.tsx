import React, { ReactElement, useState, useEffect } from "react"
import styled from "styled-components"
import { useRequest } from "../effects/use-request"

import { UsersList } from "../components/users/users-list"
import { MessagesList } from "../components/messages/messages-list"

import { User, Friend } from "../utils/interfaces"
import { theme } from "../style-guide/theme"
import { getFriendsInput } from "../utils/api-utils"

interface Props {
	user: User
}

const MainContainer = styled.div`
	height: 100vh;
	color: ${theme.colors.greys[0]};
`

const MainText = styled.p`
	margin: 0;
	padding: 1rem 2rem;
	border-bottom: 1px solid ${theme.colors.greys[1]};
`

const MessagesContainer = styled.div`
	display: flex;
`

const getMainText = (name: string): string =>
	`Hi, ${name}. You can start conversation by selecting user below.`

const getUsersFromFriends = (friends: Friend[]): User[] =>
	friends.map(
		(friend): User => ({
			id: friend.friendId,
			name: "Name",
			email: "",
		}),
	)

export const MainPage = ({ user }: Props): ReactElement => {
	const [users, setUsers] = useState<User[]>()
	const { data, start, error, isLoading } = useRequest(
		getFriendsInput(),
	)
	const [selectedUser, setSelectedUser] = useState<User>()
	const [isSearching, setIsSearching] = useState(false)

	useEffect(start, [])

	useEffect((): void => {
		data && setUsers(getUsersFromFriends(data))
	}, [data])

	useEffect((): void => {
		error && setUsers(undefined)
	}, [error])

	const updateUsersList = (users?: User[] | null): void => {
		if (users) {
			setUsers(users)

			return
		}

		if (users === null) {
			setUsers(undefined)

			return
		}

		setUsers(getUsersFromFriends(data) || [])
	}

	const handleUserSelect = (id: number): void => {
		const user = users && users.find((user): boolean => user.id === id)
		user && setSelectedUser(user)
	}

	return (
		<MainContainer>
			<MainText>{getMainText(user.name)}</MainText>

			<MessagesContainer>
				<UsersList
					users={users}
					updateUsersList={updateUsersList}
					isLoading={isLoading}
					handleUserSelect={handleUserSelect}
					isSearching={isSearching}
					setIsSearching={setIsSearching}
				/>
				<MessagesList
					selectedUserId={selectedUser ? selectedUser.id : undefined}
					isSearching={isSearching}
				/>
			</MessagesContainer>
		</MainContainer>
	)
}
