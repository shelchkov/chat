import React, { ReactElement, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { useRequest } from "../../effects/use-request"
import { Input } from "../input/input"
import { Button } from "../button/button"
import { InputTypes } from "../../utils/enums"
import { getSignInInput } from "../../utils/api-utils"
import { somethingWentWrong } from "../../utils/utils"
import { User } from "../../utils/interfaces"
import {
	passwordValidationRules,
	validationRules,
} from "../../utils/validation"

import { ErrorContainer } from "./error-container"

interface Props {
	setUser: (user: User) => void
}

type Inputs = {
	email: string
	password: string
}

export const SignInForm = ({ setUser }: Props): ReactElement => {
	const { register, handleSubmit, errors } = useForm<Inputs>()
	const { start, data, error, isLoading } = useRequest(
		getSignInInput("", ""),
	)
	const [errorMessage, setErrorMessage] = useState<string>()

	const onSubmit = (data: Inputs): void => {
		start(data)
	}

	useEffect((): void => {
		if (data && data.statusCode === 400) {
			setErrorMessage(data.message || somethingWentWrong)
		}

		if (data && data.id) {
			setUser(data)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	useEffect((): void => {
		if (error) {
			setErrorMessage(somethingWentWrong)
		}
	}, [error])

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Input
				name="email"
				label="Email"
				type={InputTypes.EMAIL}
				reference={register(validationRules)}
				error={errors.email && errors.email.type}
			/>
			<Input
				name="password"
				label="Password"
				type={InputTypes.PASSWORD}
				reference={register(passwordValidationRules)}
				error={errors.password && errors.password.type}
			/>

			{errorMessage && <ErrorContainer>{errorMessage}</ErrorContainer>}

			<Button text={`Sign in${isLoading ? "..." : ""}`} />
		</form>
	)
}
