import React, { ReactElement, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRequest } from "../../effects/use-request"

import { Input } from "../input/input"
import { Button } from "../button/button"
import { ErrorContainer } from "./error-container"

import { InputTypes, ButtonTypes } from "../../utils/enums"
import {
	requiredFieldText,
	somethingWentWrong,
} from "../../utils/utils"
import { getSignUpInput } from "../../utils/api-utils"

interface Inputs {
	email: string
	name: string
	password: string
	confirmPassword: string
}

const passwordsShouldMatch = "Passwords Should Match"

export const SignUpForm = (): ReactElement => {
	const { register, handleSubmit, errors } = useForm<Inputs>()
	const { start, data, error, isLoading } = useRequest(
		getSignUpInput("", "", ""),
	)
	const [errorMessage, setErrorMessage] = useState<string>()

	const onSubmit = (data: Inputs): void => {
		if (data.password === data.confirmPassword) {
			start({ ...data, confirmPassword: undefined })
		} else {
			setErrorMessage(passwordsShouldMatch)
		}
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
				name="name"
				label="Name"
				reference={register({ required: true })}
				error={errors.name && requiredFieldText}
			/>
			<Input
				name="password"
				label="Password"
				type={InputTypes.PASSWORD}
				reference={register({ required: true })}
				error={errors.password && requiredFieldText}
			/>
			<Input
				name="confirmPassword"
				label="Confirm Password"
				type={InputTypes.PASSWORD}
				reference={register({ required: true })}
				error={errors.confirmPassword && requiredFieldText}
			/>

			{errorMessage && <ErrorContainer>{errorMessage}</ErrorContainer>}

			<Button
				text={`Sign up${isLoading ? "..." : ""}`}
				type={ButtonTypes.SUBMIT}
			/>
		</form>
	)
}
