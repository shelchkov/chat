import React, { ReactElement, useState } from "react"
import styled from "styled-components"
import { Input } from "../components/input/input"
import { Button } from "../components/button/button"
import { theme } from "../style-guide/theme"
import { getSignedOutInputWidth } from "../utils/utils"
import { InputTypes } from "../utils/enums"

enum Forms {
	"SIGN_IN" = "SIGN_IN",
	"SIGN_UP" = "SIGN_UP",
}

const SignedOutContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	height: fill-available;
`

const SignedOutText = styled.p`
	margin-right: 2rem;
	margin-left: 2rem;
	text-align: center;
	color: ${theme.colors.greys[0]};
`

const signedOutText = "Fill out fields below to sign into your account"

const SignedOutSwitchForm = styled.p`
	width: ${getSignedOutInputWidth(0)};
	color: ${theme.colors.greys[0]};
	text-decoration: underline;
	cursor: pointer;

	@media (min-width: ${theme.breakpoints[0]}) {
		width: ${getSignedOutInputWidth(1)};
	}

`

const getSwitchFormText = (form: Forms): string =>
	form === Forms.SIGN_IN ? "Create Account" : "Sign in"

const getSignedOutButtonText = (form: Forms): string =>
	form === Forms.SIGN_IN ? "Sign in" : "Sign up"

export const SignedOutPage = (): ReactElement => {
	const [form, setForm] = useState(Forms.SIGN_IN)

	const handleSwitchForm = (): void => {
		if (form === Forms.SIGN_IN) {
			setForm(Forms.SIGN_UP)
		} else {
			setForm(Forms.SIGN_IN)
		}
	}

	return (
		<SignedOutContainer>
			<SignedOutText>{signedOutText}</SignedOutText>

			{form === Forms.SIGN_IN ?
				<>
					<Input name="email" label="Email" type={InputTypes.EMAIL} />
					<Input name="password" label="Password" type={InputTypes.PASSWORD} />
				</>
			:
				<>
					<Input name="email" label="Email" type={InputTypes.EMAIL} />
					<Input name="password" label="Password" type={InputTypes.PASSWORD} />
					<Input
						name="confirm-password"
						label="Confirm Password"
						type={InputTypes.PASSWORD}
					/>
				</>
			}

			<SignedOutSwitchForm onClick={handleSwitchForm}>
				{getSwitchFormText(form)}
			</SignedOutSwitchForm>
			<Button text={getSignedOutButtonText(form)} />
		</SignedOutContainer>
	)
}
