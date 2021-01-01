import React, { ReactElement, useState, useEffect } from "react"
import styled from "styled-components"

import { useSockets } from "../effects/use-sockets"
import { SignOut } from "../components/main/sign-out"
import { Messages } from "../components/main/messages"
import { User, Message } from "../utils/interfaces"
import { markNotFriends } from "../utils/utils"
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
	height: 86px;
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid ${theme.colors.greys[1]};

	@media (min-width: ${theme.breakpoints[1]}) {
		height: 51px;
	}
`

const MainText = styled.p`
	padding: 1rem 0.5rem 1rem 1rem;
	margin: 0;

	@media (min-width: theme.breakpoints[1]) {
		padding: 1rem 2rem;
	}
`

const MessagesContainer = styled.div`
	display: flex;
	height: calc(100% - 87px);

	@media (min-width: ${theme.breakpoints[1]}) {
		height: calc(100% - 52px);
	}
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
	const [newMessage, setNewMessage] = useState<Message>()
	const [onlineFriends, setOnlineFriends] = useState<number[]>()
	const [originalFriends, setOriginalFriends] = useState<User[]>(
		user.friends || [],
	)

	const { data } = useSockets()

	const updateUsersList = (users?: User[] | null): void => {
		if (users) {
			setFriends(markNotFriends(users, originalFriends))

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
				const newFriend = {
					id: newMessage.from,
					name: data.fromName,
					email: "",
					isOnline: true,
				} as User

				setFriends([...(friends || []), newFriend])

				setOnlineFriends([...(onlineFriends || []), newFriend.id])
			}
		}

		if (data.online) {
			setOnlineFriends(
				data.online.map(
					(onlineUser: { userId: number }): number => onlineUser.userId,
				),
			)
		}

		if (data.newUserOnline) {
			setOnlineFriends([...(onlineFriends || []), data.newUserOnline])
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
				<Messages
					friends={friends}
					updateUsersList={updateUsersList}
					onlineFriends={onlineFriends}
					user={user}
					newMessage={newMessage}
					addNewFriend={addNewFriend}
				/>
			</MessagesContainer>
		</MainContainer>
	)
}
