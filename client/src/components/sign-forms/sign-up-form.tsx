import React, { ReactElement, useState, useEffect } from "react"
import { useForm } from "react-hook-form"

import { useRequest } from "../../effects/use-request"
import { Input } from "../input/input"
import { Button } from "../button/button"
import { InputTypes, ButtonTypes } from "../../utils/enums"
import { somethingWentWrong } from "../../utils/utils"
import { getSignUpInput } from "../../utils/api-utils"
import { User } from "../../utils/interfaces"
import {
	passwordValidationRules,
	validationRules,
} from "../../utils/validation"

import { ErrorContainer } from "./error-container"

interface Props {
	setUser: (user: User) => void
}

interface Inputs {
	email: string
	name: string
	password: string
	confirmPassword: string
}

const passwordsShouldMatch = "Passwords Should Match"

export const SignUpForm = ({ setUser }: Props): ReactElement => {
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
				name="name"
				label="Name"
				reference={register(validationRules)}
				error={errors.name && errors.name.type}
			/>
			<Input
				name="password"
				label="Password"
				type={InputTypes.PASSWORD}
				reference={register(passwordValidationRules)}
				error={errors.password && errors.password.type}
			/>
			<Input
				name="confirmPassword"
				label="Confirm Password"
				type={InputTypes.PASSWORD}
				reference={register(passwordValidationRules)}
				error={errors.confirmPassword && errors.confirmPassword.type}
			/>

			{errorMessage && <ErrorContainer>{errorMessage}</ErrorContainer>}

			<Button
				text={`Sign up${isLoading ? "..." : ""}`}
				type={ButtonTypes.SUBMIT}
			/>
		</form>
	)
}
