import React, { ReactElement } from "react"

import { LoadingContainer } from "./loading.page"

import { somethingWentWrong } from "../utils/utils"

export const ErrorPage = (): ReactElement => (
	<LoadingContainer>{somethingWentWrong}</LoadingContainer>
)
