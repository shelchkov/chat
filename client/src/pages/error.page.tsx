import React, { ReactElement } from "react"

import { somethingWentWrong } from "../utils/utils"

import { LoadingContainer } from "./loading.page"

export const ErrorPage = (): ReactElement => (
	<LoadingContainer>{somethingWentWrong}</LoadingContainer>
)
