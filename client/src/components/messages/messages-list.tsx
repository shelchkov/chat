import React, { ReactElement, useEffect, useState } from "react"
import styled from "styled-components"
import { useRequest } from "../../effects/use-request"

import { Input } from "../input/input"
import { Button } from "../button/button"

import { getUsersMessagesInput } from "../../utils/api-utils"
import { Message, User } from "../../utils/interfaces"
import { theme } from "../../style-guide/theme"
import { ButtonTypes } from "../../utils/enums"

interface Props {
	selectedUserId?: number
	isSearching: boolean
	user: User | undefined
}

const MessagesListContainer = styled.div`
	width: fill-available;
`

const MessagesListContent = styled.div`
	padding: 0.6rem;
`

const Loading = styled.div`
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`

const loadingText = "Loading..."
const errorText = "Something went wrong"
const noMessagesText = "No messages"

interface CustomMessageContainerProps {
	isMyMessage?: boolean
}

const MessageContainer = styled.div`
	width: fit-content;
	padding: 0.1rem 1.1rem;
	margin-left: ${(p: CustomMessageContainerProps): string =>
		p.isMyMessage ? "auto" : "0"};
	border: 1px solid ${theme.colors.greys[1]};
	border-radius: 0.4rem;
`

const SendMessageContainer = styled.form`
	display: flex;
	padding-left: 0.6rem;
	border-top: 1px solid ${theme.colors.greys[1]};
`

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

	return (
		<MessagesListContainer>
			{isLoading ? (
				<Loading>{loadingText}</Loading>
			) : (
				<>
					<MessagesListContent>
						{messages && messages.length > 0 ? (
							messages.map(
								(message: Message): ReactElement => (
									<MessageContainer
										isMyMessage={message.from !== selectedUserId}
										key={message.id}
									>
										{message.text}
									</MessageContainer>
								),
							)
						) : (
							<>
								{error ? (
									<Loading>{errorText}</Loading>
								) : (
									<Loading>{noMessagesText}</Loading>
								)}
							</>
						)}
					</MessagesListContent>

					<SendMessageContainer>
						<Input
							name="sendTo"
							isSendMessageForm
							disabled={isLoading || !messages}
						/>
						<Button
							text="Send"
							type={ButtonTypes.SUBMIT}
							isMessagesPage
							isDisabled={isLoading || !messages}
						/>
					</SendMessageContainer>
				</>
			)}
		</MessagesListContainer>
	)
}
