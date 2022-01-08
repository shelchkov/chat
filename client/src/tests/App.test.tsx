import { shallow, ShallowWrapper } from "enzyme"
import React, { ReactNode } from "react"

import App from "../App"
import * as useUser from "../effects/use-user"
import { LoadingPage } from "../pages/loading.page"
import { SignedOutPage } from "../pages/signed-out.page"

jest.mock("../effects/use-user")

jest.mock("react", () => {
	const React = jest.requireActual("react")

	const Suspense = ({ children }: { children: ReactNode }) => children

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const lazy = () => require("../pages/signed-out.page").SignedOutPage

	return { ...React, lazy, Suspense }
})

describe("App component", () => {
	let component: ShallowWrapper
	const useUserDefault = {
		user: undefined,
		error: undefined,
		handleSignOut: jest.fn(),
		setUser: jest.fn(),
	}
	const useUserMock = jest
		.spyOn(useUser, "useUser")
		.mockReturnValue(useUserDefault)

	beforeAll(() => {
		component = shallow(<App />)
	})

	it("renders loading page", () => {
		expect(component.find(LoadingPage).exists()).toBeTruthy()
	})

	describe("and user is logged out", () => {
		beforeAll(() => {
			useUserMock.mockReturnValue({ ...useUserDefault, user: null })
			component = shallow(<App />)
		})

		it("renders signed out page", () => {
			expect(component.find(SignedOutPage).exists()).toBeTruthy()
		})
	})
})
