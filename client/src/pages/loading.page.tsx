import React, { ReactElement } from "react"
import styled from "styled-components"

import { theme } from "../style-guide/theme"
import { loadingText } from "../utils/utils"

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

export const LoadingPage = (): ReactElement => (
	<LoadingContainer>{loadingText}</LoadingContainer>
)
