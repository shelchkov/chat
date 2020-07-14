import React, { ReactElement } from "react"
import { useForm } from "react-hook-form"

import { Input } from "../input/input"
import { Button } from "../button/button"

import { InputTypes } from "../../utils/enums"

interface Inputs {
	email: string
	password: string
}

export const SignInForm = (): ReactElement => {
	const { register, handleSubmit } = useForm<Inputs>()

	const onSubmit = (data: Inputs): void => {
		console.log(data)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Input name="email" label="Email" type={InputTypes.EMAIL} reference={register({ required: true })} />
			<Input name="password" label="Password" type={InputTypes.PASSWORD} reference={register({ required: true })} />

			<Button text="Sign in" />
		</form>
	)
}
