import React, { ReactElement } from "react"
import styled from "styled-components"

import { ButtonTypes } from "../../utils/enums"
import { theme } from "../../style-guide/theme"

interface Props {
	text: string
	clickHandler?: () => void
	type?: ButtonTypes
	isMessagesPage?: boolean
	isDisabled?: boolean
}

interface CustomButtonProps {
	isMessagesPage?: boolean
	isDisabled?: boolean
}

const ButtonComponent = styled.button`
	padding: ${(p: CustomButtonProps): string =>
		p.isMessagesPage ? "0 1rem" : "0.6rem 2.2rem"};
	margin: ${(p: CustomButtonProps): string =>
		p.isMessagesPage ? ".5rem .4rem 0 .4rem" : "0"};
	height: ${(p: CustomButtonProps): string =>
		p.isMessagesPage ? "33px" : "auto"};
	color: #fff;
	background-color: ${theme.colors.greens[0]};
	border: none;
	border-radius: 0.6rem;
	font-size: 1rem;
	cursor: ${(p): string => (p.isDisabled ? "default" : "pointer")};
`

export const Button = ({
	text,
	clickHandler,
	isMessagesPage,
	isDisabled,
	type,
	...rest
}: Props): ReactElement => (
	<ButtonComponent
		onClick={isDisabled ? undefined : clickHandler}
		isMessagesPage={isMessagesPage}
		isDisabled={isDisabled}
		type={isDisabled ? ButtonTypes.BUTTON : type}
		{...rest}
	>
		{text}
	</ButtonComponent>
)
