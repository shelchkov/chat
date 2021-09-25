import React from "react"
import { shallow, ShallowWrapper } from "enzyme"

import { SignedOutPage } from "../../pages/signed-out.page"
import { SignInForm } from "../../components/sign-forms/sign-in-form"
import { SignUpForm } from "../../components/sign-forms/sign-up-form"
import { noop } from "../../utils/utils"

const createAccount = "Create Account"
const signIn = "Sign in"
const signedOutText = "Fill out fields below to sign into your account"

describe("signed out page", (): void => {
	let signedOutPage: ShallowWrapper<any, any>

	beforeEach((): void => {
		signedOutPage = shallow(<SignedOutPage setUser={noop} />)
	})

	describe("when clicking on switch", (): void => {
		const clickSwitch = (): void => {
			signedOutPage.find("#signed-out-switch").simulate("click")
		}

		it("changes switch text", (): void => {
			expect(signedOutPage.contains(createAccount)).toBeTruthy()
			expect(signedOutPage.contains(signIn)).toBeFalsy()

			clickSwitch()

			expect(signedOutPage.contains(createAccount)).toBeFalsy()
			expect(signedOutPage.contains(signIn)).toBeTruthy()

			clickSwitch()

			expect(signedOutPage.contains(createAccount)).toBeTruthy()
			expect(signedOutPage.contains(signIn)).toBeFalsy()
		})

		it("changes form", (): void => {
			expect(signedOutPage.find(SignInForm).exists()).toBeTruthy()
			expect(signedOutPage.find(SignUpForm).exists()).toBeFalsy()

			clickSwitch()

			expect(signedOutPage.find(SignInForm).exists()).toBeFalsy()
			expect(signedOutPage.find(SignUpForm).exists()).toBeTruthy()

			clickSwitch()

			expect(signedOutPage.find(SignInForm).exists()).toBeTruthy()
			expect(signedOutPage.find(SignUpForm).exists()).toBeFalsy()
		})
	})

	it("should contain signed out text", (): void => {
		expect(signedOutPage.contains(signedOutText)).toBeTruthy()
	})
})
