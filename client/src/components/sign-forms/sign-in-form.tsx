import React, { ReactElement } from "react"
import { useForm } from "react-hook-form"

import { Input } from "../input/input"
import { Button } from "../button/button"

import { InputTypes } from "../../utils/enums"

interface Inputs {
	email: string
	password: string
}

const requiredFieldText = "Required filed"

export const SignInForm = (): ReactElement => {
	const { register, handleSubmit, errors } = useForm<Inputs>()

	const onSubmit = (data: Inputs): void => {
		console.log(data)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Input name="email" label="Email" type={InputTypes.EMAIL} reference={register({ required: true })} error={errors.email && requiredFieldText} />
			<Input name="password" label="Password" type={InputTypes.PASSWORD} reference={register({ required: true })} error={errors.password && requiredFieldText} />

			<Button text="Sign in" />
		</form>
	)
}
