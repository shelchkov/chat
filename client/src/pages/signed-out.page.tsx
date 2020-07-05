import React, { ReactElement } from "react"
import { Input } from "../components/input/input"

export const SignedOutPage = (): ReactElement => (
	<div>
		<Input name="email" label="Email" />
		<Input name="password" label="Password" />
	</div>
)
