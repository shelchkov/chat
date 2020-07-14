import React, { ReactElement, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useRequest } from "../../effects/use-request"

import { Input } from "../input/input"
import { Button } from "../button/button"
import { ErrorContainer } from "./error-container"

import { InputTypes } from "../../utils/enums"
import { getSignInInput } from "../../utils/api-utils"
import {
	somethingWentWrong,
	requiredFieldText,
} from "../../utils/utils"

interface Inputs {
	email: string
	password: string
}

export const SignInForm = (): ReactElement => {
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
			console.log(data)
		}
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
				reference={register({ required: true })}
				error={errors.email && requiredFieldText}
			/>
			<Input
				name="password"
				label="Password"
				type={InputTypes.PASSWORD}
				reference={register({ required: true })}
				error={errors.password && requiredFieldText}
			/>

			{errorMessage && <ErrorContainer>{errorMessage}</ErrorContainer>}

			<Button text={`Sign in${isLoading ? "..." : ""}`} />
		</form>
	)
}
