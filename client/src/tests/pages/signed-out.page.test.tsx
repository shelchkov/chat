import React from "react"
import { shallow } from "enzyme"
import {
	SignedOutPage,
	SignedOutSwitchForm,
} from "../../pages/signed-out.page"
import { SignInForm } from "../../components/sign-forms/sign-in-form"
import { SignUpForm } from "../../components/sign-forms/sign-up-form"

const createAccount = "Create Account"
const signIn = "Sign in"
const signedOutText = "Fill out fields below to sign into your account"

describe("signed out page", (): void => {
	let signedOutPage

	beforeEach((): void => {
		const setUser = (): void => {}
		signedOutPage = shallow(<SignedOutPage setUser={setUser} />)
	})

	describe("when clicking on switch", (): void => {
		const clickSwitch = (): void =>
			signedOutPage.find("#signed-out-switch").simulate("click")

		it("changes switch text", (): void => {
			expect(signedOutPage.contains(createAccount)).toEqual(true)
			expect(signedOutPage.contains(signIn)).toEqual(false)

			clickSwitch()

			expect(signedOutPage.contains(createAccount)).toEqual(false)
			expect(signedOutPage.contains(signIn)).toEqual(true)
		})

		it("changes form", (): void => {
			expect(signedOutPage.find(SignInForm).length).toEqual(1)
			expect(signedOutPage.find(SignUpForm).length).toEqual(0)

			clickSwitch()

			expect(signedOutPage.find(SignInForm).length).toEqual(0)
			expect(signedOutPage.find(SignUpForm).length).toEqual(1)
		})
	})

	it("should contain signed out text", (): void => {
		expect(signedOutPage.contains(signedOutText)).toEqual(true)
	})
})
