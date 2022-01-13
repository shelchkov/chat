import React, { ReactElement, createRef, useEffect } from "react"
import styled from "styled-components"

import { Message, User } from "../../utils/interfaces"
import { theme } from "../../style-guide/theme"

import { SendMessageForm } from "./send-message.form"

interface Props {
	messages: Message[] | undefined
	selectedUser: User | undefined
	isLoading: boolean
	error?: string
	isMobile?: boolean
	addMessage: (message: Message) => void
	showUsersList?: () => void
	handleTyping: (receiverId: number, isStopping?: boolean) => void
}

const MessagesListContent = styled.div<{ isMobile?: boolean }>`
	padding: 0.6rem 0.6rem 0.4rem 0.6rem;
	overflow-y: auto;
	${(p): string => (p.isMobile ? "height: 100%;" : "")}
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

const BackButtonContainer = styled.div`
	height: 2.125rem;
	min-height: 2.125rem;
	display: flex;
	border-bottom: 1px solid ${theme.colors.greys[1]};
`

const BackButton = styled.p`
	position: absolute;
	margin: 0;
	padding: 0.5rem 1.3rem;
	width: fit-content;
	text-decoration: underline;
	cursor: pointer;
`

const UserName = styled.p`
	margin: 0 auto;
	font-size: 1rem;
	font-weight: bold;
	line-height: 2.125rem;
`

const errorText = "Something went wrong"
const noMessagesText = "No messages"
const backButtonText = "Back"

export const MessagesListAndForm = ({
	messages,
	selectedUser,
	isLoading,
	error,
	addMessage,
	isMobile,
	showUsersList,
	handleTyping,
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
			{isMobile && (
				<BackButtonContainer>
					<BackButton onClick={showUsersList}>
						{backButtonText}
					</BackButton>
					<UserName>{selectedUser && selectedUser.name}</UserName>
				</BackButtonContainer>
			)}

			<MessagesListContent ref={messagesListRef} isMobile={isMobile}>
				{messages && messages.length > 0 ? (
					messages.map(
						(message: Message): ReactElement => (
							<MessageContainer
								isMyMessage={
									selectedUser && message.from !== selectedUser.id
								}
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
				selectedUserId={selectedUser && selectedUser.id}
				addMessage={addMessage}
				isMobile={isMobile}
				handleTyping={handleTyping}
			/>
		</>
	)
}
