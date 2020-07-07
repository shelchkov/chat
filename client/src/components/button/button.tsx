import React, { ReactElement } from "react"
import styled from "styled-components"

interface Props {
	text: string
	clickHandler?: () => void
}

const ButtonComponent = styled.button`
	padding: .6rem 2.2rem;
	color: #fff;
	background-color: limegreen;
	border: none;
	border-radius: .6rem;
	font-size: 1rem;
`

export const Button = ({ text, clickHandler }: Props): ReactElement => (
	<ButtonComponent onClick={clickHandler}>{text}</ButtonComponent>
)
