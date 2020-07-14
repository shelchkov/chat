import React, { ReactElement } from "react"

import { Input } from "../input/input"
import { Button } from "../button/button"

import { InputTypes } from "../../utils/enums"

export const SignInForm = (): ReactElement => {
	return (
		<form>
			<Input name="email" label="Email" type={InputTypes.EMAIL} />
			<Input name="password" label="Password" type={InputTypes.PASSWORD} />
			<Button text="Sign in" />
		</form>
	)
}
