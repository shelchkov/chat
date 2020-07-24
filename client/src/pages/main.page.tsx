import React, { ReactElement, useState, useEffect } from "react"
import styled from "styled-components"
import { useSockets } from "../effects/use-sockets"

import { UsersList } from "../components/users/users-list"
import { MessagesList } from "../components/messages/messages-list"
import { SignOut } from "../components/main/sign-out"

import { User, Message } from "../utils/interfaces"
import { theme } from "../style-guide/theme"

interface Props {
	user: User
	handleSignOut: () => void
}

const MainContainer = styled.div`
	height: 100vh;
	color: ${theme.colors.greys[0]};
`

const MainTextContainer = styled.div`
	height: 51px;
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid ${theme.colors.greys[1]};
`

const MainText = styled.p`
	margin: 0;
	padding: 1rem 2rem;
`

const MessagesContainer = styled.div`
	display: flex;
	height: calc(100% - 51px);
`

const getMainText = (name: string): string =>
	`Hi, ${name}. You can start conversation by selecting user below.`

export const MainPage = ({
	user,
	handleSignOut,
}: Props): ReactElement => {
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

	const { data } = useSockets()

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
		if (!data) {
			return
		}

		if (data.newMessage) {
			const newMessage = data.newMessage
			setNewMessage(newMessage)

			if (
				!friends ||
				!friends.find(
					(friend): boolean => friend.id === newMessage.from,
				)
			) {
				setFriends([
					...(friends || []),
					{
						id: newMessage.from,
						name: data.fromName,
						email: "",
						isOnline: true,
					} as User,
				])
			}
		}

		if (data.online) {
			setOnlineFriends(
				data.online.map(
					(onlineUser: { userId: number }): number => onlineUser.userId,
				),
			)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const addNewFriend = (userId: number): void => {
		if (
			friends &&
			!originalFriends.find((friend): boolean => friend.id === userId)
		) {
			const newFriend = friends.find(
				(friend): boolean => friend.id === userId,
			)

			newFriend &&
				setOriginalFriends([...(originalFriends || []), newFriend])
		}
	}

	return (
		<MainContainer>
			<MainTextContainer>
				<MainText>{getMainText(user.name)}</MainText>
				<SignOut handleSignOut={handleSignOut} />
			</MainTextContainer>

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
