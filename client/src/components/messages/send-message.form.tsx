import React, { ReactElement, useEffect, createRef } from "react"
import styled from "styled-components"
import { useForm } from "react-hook-form"

import { useRequest } from "../../effects/use-request"
import { Input } from "../input/input"
import { Button } from "../button/button"
import { Message } from "../../utils/interfaces"
import { theme } from "../../style-guide/theme"
import { ButtonTypes } from "../../utils/enums"
import { getSendMessageInput } from "../../utils/api-utils"
import { useInputFocus } from "../../effects/use-input-focus"
import { validationRules } from "../../utils/validation"
import { useTyping } from "../../effects/use-typing"

interface Props {
	isLoading: boolean
	selectedUserId: number | undefined
	error?: string
	isMobile?: boolean
	addMessage: (message: Message) => void
	handleTyping: (receiverId: number, isStopping?: boolean) => void
}

const SendMessageContainer = styled.form`
	display: flex;
	padding-left: 0.6rem;
	border-top: 1px solid ${theme.colors.greys[1]};
`

interface Inputs {
	message: string
}

export const SendMessageForm = ({
	isLoading,
	error,
	selectedUserId,
	isMobile,
	addMessage,
	handleTyping,
}: Props): ReactElement => {
	const { data, start } = useRequest(getSendMessageInput())
	const { register, handleSubmit, reset } = useForm<Inputs>()
	const inputRef = createRef<HTMLInputElement>()

	useInputFocus(isMobile ? undefined : inputRef)

	const { handleChange } = useTyping(handleTyping, selectedUserId)

	const onSubmit = (data: Inputs): void => {
		start({ text: data.message }, String(selectedUserId))
	}

	useEffect((): void => {
		if (data) {
			addMessage(data)
			reset()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const isDisabled = !selectedUserId || isLoading || !!error

	useEffect(() => {
		if (inputRef.current) {
			register(validationRules)(inputRef.current)
			try {
				inputRef.current.scrollIntoView()
			} catch {}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<SendMessageContainer onSubmit={handleSubmit(onSubmit)}>
			<Input
				name="message"
				isSendMessageForm
				disabled={isDisabled}
				reference={inputRef}
				placeholder="Type your message"
				onChange={handleChange}
			/>
			<Button
				text="Send"
				type={ButtonTypes.SUBMIT}
				isMessagesPage
				isDisabled={isDisabled}
			/>
		</SendMessageContainer>
	)
}
