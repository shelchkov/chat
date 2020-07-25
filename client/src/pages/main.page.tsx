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
	const [onlineFriends, setOnlineFriends] = useState<number[]>()

	const [originalFriends, setOriginalFriends] = useState<User[]>(
		user.friends || [],
	)

	const updateUsersList = (users?: User[] | null): void => {
		if (users) {
			setFriends(users)

			return
		}

		if (users === null) {
			setFriends(undefined)

			return
		}

		setFriends(originalFriends)
	}

	useEffect((): void => {
		const ws = new WebSocket(socketUrl)

		ws.onmessage = (event): void => {
			const data = JSON.parse(event.data)

			if (data.newMessage) {
				const newMessage = data.newMessage
				setNewMessage(newMessage)

				if (
					!friends ||
					!friends.find(
						(friend): boolean => friend.id === newMessage.from,
					)
				) {
					console.log("Add new friend after receiving new message")
					setFriends([
						...(friends || []),
						{
							id: newMessage.from,
							name: data.fromName,
							email: "",
							isOnline: true,
						},
					])
				}
			}

			if (data.online) {
				setOnlineFriends(
					data.online.map(
						(onlineUser: { userId: number }): number =>
							onlineUser.userId,
					),
				)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const addNewFriend = (userId: number): void => {
		console.log({ originalFriends })
		console.log({ friends })
		console.log("Add", userId)
		if (
			friends &&
			!originalFriends.find((friend): boolean => friend.id === userId)
		) {
			console.log("Add new friend")
			const newFriend = friends.find(
				(friend): boolean => friend.id === userId,
			)
			console.log(newFriend)
			newFriend &&
				setOriginalFriends([...(originalFriends || []), newFriend])
		}
	}

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
					onlineFriends={onlineFriends}
				/>
				<MessagesList
					selectedUserId={selectedFriendId}
					isSearching={isSearching}
					user={user}
					newMessage={newMessage}
					addNewFriend={addNewFriend}
				/>
			</MessagesContainer>
		</MainContainer>
	)
}
