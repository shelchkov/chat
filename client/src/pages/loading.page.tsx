import React, { ReactElement } from "react"
import styled from "styled-components"

import { theme } from "../style-guide/theme"

export const LoadingContainer = styled.div`
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 3rem;
	color: ${theme.colors.greys[0]};
	font-size: 1.8rem;
	text-align: center;
`

const loadingText = "Loading..."

export const LoadingPage = (): ReactElement => (
	<LoadingContainer>{loadingText}</LoadingContainer>
)
