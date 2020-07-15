import React, { ReactElement } from "react"
import styled from "styled-components"

import { AddFriendForm } from "./add-friend.form"
import { UserCard } from "./user-card"

import { User } from "../../utils/interfaces"
import { theme } from "../../style-guide/theme"

interface Props {
	users: User[]
}

const UsersBlockContainer = styled.div`
	width: 40%;
	border-right: 1px solid ${theme.colors.greys[1]};
`

const UsersListContainer = styled.div`
	height: 100%;
	margin-top: 0.4rem;
	border-top: 1px solid ${theme.colors.greys[1]};
`

const NoUsersContainer = styled.div`
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`

const noUsersText = "Add users by searching above."

export const UsersList = ({ users }: Props): ReactElement => (
	<UsersBlockContainer>
		<AddFriendForm />

		<UsersListContainer>
			{users.length > 0 ? (
				users.map(
					(user): ReactElement => (
						<UserCard user={user} key={user.id} />
					),
				)
			) : (
				<NoUsersContainer>{noUsersText}</NoUsersContainer>
			)}
		</UsersListContainer>
	</UsersBlockContainer>
)
