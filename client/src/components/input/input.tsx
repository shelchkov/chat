import React, { ReactElement, ChangeEvent } from "react"
import styled from "styled-components"
import { theme } from "../../style-guide/theme"
import { getSignedOutInputWidth } from "../../utils/utils"
import { InputTypes } from "../../utils/enums"

interface Props {
	label?: string
	name: string
	onChange?: (event: ChangeEvent) => void
	type?: InputTypes
	reference?: any
	error?: string
	placeholder?: string
	isAddFriendForm?: boolean
}

interface CustomInputProps {
	isAddFriendForm?: boolean
}

const InputContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: ${getSignedOutInputWidth(0)};
	margin: 0.5rem 0 0.8rem
		${(p: CustomInputProps): string =>
			p.isAddFriendForm ? ".4rem" : "0"};

	@media (min-width: ${theme.breakpoints[0]}) {
		width: ${(p: CustomInputProps): string =>
			p.isAddFriendForm ? "180px" : getSignedOutInputWidth(1)};
	}
`

const InputLabel = styled.label`
	margin-bottom: 0.3rem;
	margin-left: 0.4rem;
	color: ${theme.colors.greys[0]};
`

const InputComponent = styled.input`
	padding: 0.4rem 0.6rem;
	border-radius: 0.4rem;
	border: 1px solid ${theme.colors.greys[1]};
	font-size: 1rem;
	outline: none;
`

const ErrorContainer = styled.p`
	margin-top: 0.2rem;
	margin-bottom: 0;
	color: red;
	font-size: 0.7rem;
`

export const Input = ({
	label,
	name,
	reference,
	error,
	isAddFriendForm,
	...rest
}: Props): ReactElement => (
	<InputContainer isAddFriendForm={isAddFriendForm}>
		{label && (
			<InputLabel htmlFor={`${name}-input`}>{label}</InputLabel>
		)}
		<InputComponent
			id={`${name}-input`}
			name={name}
			ref={reference}
			{...rest}
		/>

		{error && <ErrorContainer>{error}</ErrorContainer>}
	</InputContainer>
)
