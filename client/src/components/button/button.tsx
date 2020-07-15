import React, { ReactElement } from "react"
import styled from "styled-components"

import { ButtonTypes } from "../../utils/enums"

interface Props {
	text: string
	clickHandler?: () => void
	type?: ButtonTypes
	isAddFriendForm?: boolean
}

interface CustomButtonProps {
	isAddFriendForm?: boolean
}

const ButtonComponent = styled.button`
	padding: ${(p: CustomButtonProps): string =>
		p.isAddFriendForm ? "0 1rem" : "0.6rem 2.2rem"};
	margin: ${(p: CustomButtonProps): string =>
		p.isAddFriendForm ? ".5rem .4rem 0 .4rem" : "0"};
	height: ${(p: CustomButtonProps): string =>
		p.isAddFriendForm ? "33px" : "auto"};
	color: #fff;
	background-color: limegreen;
	border: none;
	border-radius: 0.6rem;
	font-size: 1rem;
	cursor: pointer;
`

export const Button = ({
	text,
	clickHandler,
	isAddFriendForm,
	...rest
}: Props): ReactElement => (
	<ButtonComponent
		onClick={clickHandler}
		isAddFriendForm={isAddFriendForm}
		{...rest}
	>
		{text}
	</ButtonComponent>
)
