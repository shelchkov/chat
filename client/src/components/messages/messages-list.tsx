import React, { ReactElement, useEffect } from "react"
import styled from "styled-components"

import { useMessages } from "../../effects/use-messages"
import { Message, User } from "../../utils/interfaces"
import { noop } from "../../utils/utils"

import { MessagesListAndForm, Loading } from "./messages-list-and-form"

interface Props {
	isSearching: boolean
	user: User | undefined
	newMessage: Message | undefined
	selectedUser?: User
	isMobile?: boolean
	addNewFriend: (userId: number) => void
	showUsersList?: () => void
	handleNewMessage?: (message: Message) => void
}

const MessagesListContainer = styled.div`
	width: fill-available;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`

const loadingText = "Loading..."

export const MessagesList = ({
	selectedUser,
	isSearching,
	user,
	newMessage,
	addNewFriend,
	isMobile,
	showUsersList,
	handleNewMessage = noop,
}: Props): ReactElement => {
	const { messages, isLoading, error, addNewMessage } = useMessages(
		isSearching,
		user,
		selectedUser,
	)

	const addMessage = (message: Message): void => {
		if (!messages) {
			addNewFriend(message.to)
		}

		addNewMessage(message)
		handleNewMessage(message)
	}

	useEffect((): void => {
		if (!user || !newMessage || !selectedUser) {
			return
		}

		if (
			newMessage.from === selectedUser.id &&
			!(messages || []).find(
				(message): boolean => message.id === newMessage.id,
			)
		) {
			addMessage(newMessage)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [newMessage, addMessage, selectedUser])

	return (
		<MessagesListContainer>
			{isLoading ? (
				<Loading>{loadingText}</Loading>
			) : (
				<MessagesListAndForm
					messages={messages}
					selectedUser={selectedUser}
					error={error}
					isLoading={isLoading}
					addMessage={addMessage}
					isMobile={isMobile}
					showUsersList={showUsersList}
				/>
			)}
		</MessagesListContainer>
	)
}
