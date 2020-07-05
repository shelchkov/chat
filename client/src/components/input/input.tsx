import React, { ReactElement, ChangeEvent } from "react"
import styled from "styled-components"
import { theme } from "../../style-guide/theme"
import { getSignedOutInputWidth } from "../../utils/utils"

interface Props {
	label: string
	name: string
	onChange?: (event: ChangeEvent) => void
}

const InputContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: ${getSignedOutInputWidth(0)};
	margin: .5rem 0 .8rem 0;

	@media (min-width: ${theme.breakpoints[0]}) {
		width: ${getSignedOutInputWidth(1)};
	}
`

const InputLabel = styled.label`
	margin-bottom: .3rem;
	margin-left: .4rem;
	color: ${theme.colors.greys[0]};
`

const InputComponent = styled.input`
	padding: .4rem .6rem;
	border-radius: .4rem;
	border: 1px solid ${theme.colors.greys[1]};
	font-size: 1rem;
	outline: none;
`

export const Input = ({ label, name, onChange }: Props): ReactElement => (
	<InputContainer>
		<InputLabel htmlFor={`${name}-input`}>{label}</InputLabel>
		<InputComponent
			id={`${name}-input`}
			name={name}
			onChange={onChange}
		/>
	</InputContainer>
)
