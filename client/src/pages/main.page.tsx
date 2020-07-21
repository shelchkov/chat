import React, { ReactElement, useState, useEffect } from "react"
import styled from "styled-components"

import { UsersList } from "../components/users/users-list"
import { MessagesList } from "../components/messages/messages-list"

import { User, Message } from "../utils/interfaces"
import { theme } from "../style-guide/theme"
import { socketUrl } from "../utils/api-utils"

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
	height: calc(100% - 51px);
`

const getMainText = (name: string): string =>
	`Hi, ${name}. You can start conversation by selecting user below.`

export const MainPage = ({ user }: Props): ReactElement => {
	const [friends, setFriends] = useState<User[] | undefined>(
		user.friends || [],
	)
	const [selectedFriendId, setSelectedFriendId] = useState<number>()
	const [isSearching, setIsSearching] = useState(false)

	const [newMessage, setNewMessage] = useState<Message>()

	const updateUsersList = (users?: User[] | null): void => {
		if (users) {
			setFriends(users)

			return
		}

		if (users === null) {
			setFriends(undefined)

			return
		}

		setFriends(user.friends || [])
	}

	useEffect((): void => {
		const ws = new WebSocket(socketUrl)

		ws.onmessage = (event): void => {
			const message = JSON.parse(event.data)
			setNewMessage(message)
		}
	}, [])

	return (
		<MainContainer>
			<MainText>{getMainText(user.name)}</MainText>

			<MessagesContainer>
				<UsersList
					users={friends}
					updateUsersList={updateUsersList}
					handleUserSelect={setSelectedFriendId}
					isSearching={isSearching}
					setIsSearching={setIsSearching}
				/>
				<MessagesList
					selectedUserId={selectedFriendId}
					isSearching={isSearching}
					user={user}
					newMessage={newMessage}
				/>
			</MessagesContainer>
		</MainContainer>
	)
}
