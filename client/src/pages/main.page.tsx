import React, { ReactElement, useState } from "react"
import styled from "styled-components"

import { UsersList } from "../components/users/users-list"

import { User } from "../utils/interfaces"
import { theme } from "../style-guide/theme"

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

const MessagesList = styled.div`
	width: fill-available;
`

const getMainText = (name: string): string =>
	`Hi, ${name}. Start conversation by selecting user below.`

export const MainPage = ({ user }: Props): ReactElement => {
	const [users, setUsers] = useState<User[]>()

	const updateUsersList = (users?: User[] | null): void => {
		if (users) {
			setUsers(users)

			return
		}

		if (users === null) {
			setUsers(undefined)

			return
		}

		setUsers([])
	}

	return (
		<MainContainer>
			<MainText>{getMainText(user.name)}</MainText>

			<MessagesContainer>
				<UsersList users={users} updateUsersList={updateUsersList} />
				<MessagesList />
			</MessagesContainer>
		</MainContainer>
	)
}
