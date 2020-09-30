import React, { ReactElement, useState } from "react"
import styled from "styled-components"

import { SignInForm } from "../components/sign-forms/sign-in-form"
import { SignUpForm } from "../components/sign-forms/sign-up-form"
import { theme } from "../style-guide/theme"
import { getSignedOutInputWidth } from "../utils/utils"
import { User } from "../utils/interfaces"

interface Props {
	setUser: (user: User) => void
}

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

export const SignedOutPage = ({ setUser }: Props): ReactElement => {
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

			{form === Forms.SIGN_IN ? (
				<SignInForm setUser={setUser} />
			) : (
				<SignUpForm setUser={setUser} />
			)}

			<SignedOutSwitchForm
				onClick={handleSwitchForm}
				id="signed-out-switch"
			>
				{getSwitchFormText(form)}
			</SignedOutSwitchForm>
		</SignedOutContainer>
	)
}
