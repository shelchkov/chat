import React from "react"
import { ReactWrapper, mount } from "enzyme"
import { act } from "@testing-library/react"

import { SignOut } from "../../../components/main/sign-out"
import * as useRequest from "../../../effects/use-request"

jest.mock("../../../effects/use-request")

const signOutText = "Sign Out"
const errorText = "Error"

describe("sign out", (): void => {
	const handleSignOut = jest.fn()

	const start = jest.fn()
	const useRequestSpy = jest
		.spyOn(useRequest, "useRequest")
		.mockReturnValue({ start, isLoading: false, resetData: jest.fn() })

	let signOut: ReactWrapper

	beforeEach((): void => {
		signOut = mount(<SignOut handleSignOut={handleSignOut} />)
	})

	it("shows sign out text", () => {
		expect(signOut.contains(signOutText)).toEqual(true)
	})

	it("doesn't make a request to the back-end before clicking", (): void => {
		expect(start).not.toBeCalled()

		setImmediate((): void => {
			expect(signOut.contains("...")).toEqual(false)
			expect(handleSignOut).not.toHaveBeenCalled()
		})
	})

	describe("when clicking sign out button", (): void => {
		it("makes request", async (): Promise<void> => {
			act(() => {
				signOut.simulate("click")
			})

			expect(start).toBeCalled()
		})

		it("indicates that loading is in progress", () => {
			useRequestSpy.mockReturnValue({
				isLoading: true,
				start: jest.fn(),
				resetData: jest.fn(),
			})
			signOut = mount(<SignOut handleSignOut={handleSignOut} />)

			expect(signOut.contains(`${signOutText}...`)).toBeTruthy()
		})

		describe("and request is unsuccessful", () => {
			beforeAll((): void => {
				useRequestSpy.mockReturnValue({
					isLoading: false,
					error: "Error message",
					start: jest.fn(),
					resetData: jest.fn(),
				})
				signOut = mount(<SignOut handleSignOut={handleSignOut} />)
			})

			it("doesn't call handleSignOut", () => {
				expect(handleSignOut).not.toHaveBeenCalled()
				expect(signOut.contains(errorText)).toBeTruthy()
			})
		})

		describe("and request is successful", (): void => {
			beforeEach((): void => {
				useRequestSpy.mockReturnValue({
					isLoading: false,
					data: { success: true },
					resetData: jest.fn(),
					start: jest.fn(),
				})
				signOut = mount(<SignOut handleSignOut={handleSignOut} />)
			})

			it("changes button text and calls handleSignOut", (): void => {
				expect(signOut.contains(errorText)).toBeFalsy()
				expect(handleSignOut).toHaveBeenCalled()
			})
		})
	})
})
