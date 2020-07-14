import React, { ReactElement } from "react"
import { useForm } from "react-hook-form"

import { Input } from "../input/input"
import { Button } from "../button/button"

import { InputTypes, ButtonTypes } from "../../utils/enums"

interface Inputs {
	email: string
	password: string
	confirmPassword: string
}

const requiredFieldText = "Required filed"

export const SignUpForm = (): ReactElement => {
	const { register, handleSubmit, errors } = useForm<Inputs>()

	const onSubmit = (data: Inputs): void => {
		console.log(data)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Input name="email" label="Email" type={InputTypes.EMAIL} reference={register({ required: true })} error={errors.email && requiredFieldText} />
			<Input name="password" label="Password" type={InputTypes.PASSWORD} reference={register({ required: true })} error={errors.password && requiredFieldText} />
			<Input
				name="confirmPassword"
				label="Confirm Password"
				type={InputTypes.PASSWORD}
				reference={register({ required: true })}
				error={errors.confirmPassword && requiredFieldText}
			/>

			<Button text="Sign up" type={ButtonTypes.SUBMIT} />
		</form>
	)
}
