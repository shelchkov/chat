import React, { ReactElement, useEffect, useState } from "react"
import styled from "styled-components"

import { useRequest } from "../../effects/use-request"
import { getUsersMessagesInput } from "../../utils/api-utils"
import { Message, User } from "../../utils/interfaces"

import { MessagesListAndForm, Loading } from "./messages-list-and-form"

interface Props {
	isSearching: boolean
	user: User | undefined
	newMessage: Message | undefined
	selectedUser?: User
	isMobile?: boolean
	addNewFriend: (userId: number) => void
	showUsersList?: () => void
}

const MessagesListContainer = styled.div`
	width: fill-available;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`

const loadingText = "Loading..."

const findFriend = (
	user: User | undefined,
	friendId: number,
): User | undefined =>
	user &&
	user.friends &&
	user.friends.find((friend): boolean => friend.id === friendId)

export const MessagesList = ({
	selectedUser,
	isSearching,
	user,
	newMessage,
	addNewFriend,
	isMobile,
	showUsersList,
}: Props): ReactElement => {
	const { start, data, isLoading, error } = useRequest(
		getUsersMessagesInput(),
	)
	const [messages, setMessages] = useState<Message[]>()

	useEffect((): void => {
		setMessages(undefined)

		selectedUser &&
			(!isSearching || findFriend(user, selectedUser.id)) &&
			start(undefined, String(selectedUser.id))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedUser])

	useEffect((): void => {
		if (!data) {
			return
		}

		if (data.statusCode) {
			setMessages(undefined)

			return
		}

		setMessages(data)
	}, [data])

	const addMessage = (message: Message): void => {
		if (!messages) {
			addNewFriend(message.to)
		}

		setMessages([...(messages || []), message])
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
