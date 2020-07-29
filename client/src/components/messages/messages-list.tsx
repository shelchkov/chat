import React, { ReactElement, useEffect, useState } from "react"
import styled from "styled-components"
import { useRequest } from "../../effects/use-request"

import { MessagesListAndForm, Loading } from "./messages-list-and-form"

import { getUsersMessagesInput } from "../../utils/api-utils"
import { Message, User } from "../../utils/interfaces"

interface Props {
	selectedUserId?: number
	isSearching: boolean
	user: User | undefined
	newMessage: Message | undefined
	addNewFriend: (userId: number) => void
	isMobile?: boolean
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
	selectedUserId,
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
		selectedUserId &&
			(!isSearching || findFriend(user, selectedUserId)) &&
			start(undefined, String(selectedUserId))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedUserId])

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
		if (!user || !newMessage) {
			return
		}

		if (
			newMessage.from === selectedUserId &&
			!(messages || []).find(
				(message): boolean => message.id === newMessage.id,
			)
		) {
			addMessage(newMessage)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [newMessage, addMessage, selectedUserId])

	return (
		<MessagesListContainer>
			{isLoading ? (
				<Loading>{loadingText}</Loading>
			) : (
				<MessagesListAndForm
					messages={messages}
					selectedUserId={selectedUserId}
					error={error}
					isLoading={isLoading}
					addMessage={addMessage}
					shouldShowBackBtn={isMobile}
					showUsersList={showUsersList}
				/>
			)}
		</MessagesListContainer>
	)
}
