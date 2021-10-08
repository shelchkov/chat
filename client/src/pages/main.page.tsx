import React, { ReactElement } from "react"
import styled from "styled-components"

import { SignOut } from "../components/main/sign-out"
import { Messages } from "../components/main/messages"
import { User } from "../utils/interfaces"
import { theme } from "../style-guide/theme"
import { useUserSockets } from "../effects/use-user-sockets"
import { useFriends } from "../effects/use-friends"
import { useArrayState } from "../effects/use-array-state"

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
	const { friends, addFriend, updateUsersList, addNewFriend } = useFriends(user.friends)
	const [onlineFriends, setOnlineFriends, addNewOnlineFriend] = useArrayState<number>()
	const { newMessage } = useUserSockets(
		friends,
		addFriend,
		addNewOnlineFriend,
		setOnlineFriends,
	)

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
