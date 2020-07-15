import React, { ReactElement } from "react"
import { LoadingContainer } from "./loading.page"

const errorText = `Something went wrong. Please try again.`

export const ErrorPage = (): ReactElement => (
	<LoadingContainer>{errorText}</LoadingContainer>
)
