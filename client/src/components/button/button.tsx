import React, { ReactElement } from "react"
import styled from "styled-components"

import { ButtonTypes } from "../../utils/enums"

interface Props {
	text: string
	clickHandler?: () => void
	type?: ButtonTypes
}

const ButtonComponent = styled.button`
	padding: .6rem 2.2rem;
	color: #fff;
	background-color: limegreen;
	border: none;
	border-radius: .6rem;
	font-size: 1rem;
`

export const Button = ({ text, clickHandler, ...rest }: Props): ReactElement => (
	<ButtonComponent onClick={clickHandler} {...rest}>{text}</ButtonComponent>
)
