import React, { ReactElement, createRef, useEffect } from "react"
import styled from "styled-components"

import { SendMessageForm } from "./send-message.form"

import { Message } from "../../utils/interfaces"
import { theme } from "../../style-guide/theme"

interface Props {
	messages: Message[] | undefined
	selectedUserId: number | undefined
	isLoading: boolean
	error?: string
	addMessage: (message: Message) => void
}

const MessagesListContent = styled.div`
	padding: 0.6rem 0.6rem 0.4rem 0.6rem;
	overflow-y: auto;
`

interface CustomMessageContainerProps {
	isMyMessage?: boolean
}

const MessageContainer = styled.div`
	width: fit-content;
	max-width: 60%;
	padding: 0.1rem 1.1rem;
	margin-left: ${(p: CustomMessageContainerProps): string =>
		p.isMyMessage ? "auto" : "0"};
	margin-bottom: 0.2rem;
	border: 1px solid ${theme.colors.greys[1]};
	border-radius: 0.4rem;
`

export const Loading = styled.div`
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`

const errorText = "Something went wrong"
const noMessagesText = "No messages"

export const MessagesListAndForm = ({
	messages,
	selectedUserId,
	isLoading,
	error,
	addMessage,
}: Props): ReactElement => {
	const messagesListRef = createRef<HTMLDivElement>()

	useEffect((): void => {
		if (messagesListRef && messagesListRef.current) {
			const fullHeight = messagesListRef.current.scrollHeight
			const height = messagesListRef.current.clientHeight

			if (fullHeight > height) {
				messagesListRef.current.scroll(0, fullHeight - height)
			}
		}
	}, [messagesListRef])

	return (
		<>
			<MessagesListContent ref={messagesListRef}>
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

			<SendMessageForm
				isLoading={isLoading}
				error={error}
				selectedUserId={selectedUserId}
				addMessage={addMessage}
			/>
		</>
	)
}
