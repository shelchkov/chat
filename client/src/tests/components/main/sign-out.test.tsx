import React from "react"
import { SignOut } from "../../../components/main/sign-out"
import { shallow } from "enzyme"

const signOutText = "Sign Out"
const errorText = "Error"

describe("sign out", (): void => {
	const handleSignOut = jest.fn().mockImplementation((): void => {})

	describe("when clicking sign out button", (): void => {
		let fetch
		let json
		let signOut

		beforeEach((): void => {
			json = jest.fn().mockResolvedValue({ success: true })
			fetch = jest.fn().mockResolvedValue({ json })
			global.fetch = fetch
			signOut = shallow(<SignOut handleSignOut={handleSignOut} />)
		})

		it("should not make a request to the back-end before clicking", (): void => {
			const fetchSpy = jest.spyOn(global, "fetch")
			expect(signOut.contains(signOutText)).toEqual(true)
			expect(fetchSpy).not.toBeCalled()

			setTimeout((): void => {
				expect(signOut.contains("...")).toEqual(false)
				expect(handleSignOut).not.toHaveBeenCalled()
			})
		})

		it("should make a request after click", async (): Promise<void> => {
			const fetchSpy = jest.spyOn(global, "fetch")

			signOut.simulate("click")

			signOut.contains(`${signOutText}...`)
			expect(fetchSpy).toBeCalled()

			setTimeout((): void => {
				expect(signOut.contains("...")).toEqual(false)
				expect(handleSignOut).toHaveBeenCalled()
			})
		})

		describe("and request is not successful", (): void => {
			beforeEach((): void => {
				json = jest
					.fn()
					.mockRejectedValue({ message: "something went wrong" })
			})

			it("should change button text", (): void => {
				signOut.simulate("click")
				signOut.contains(errorText)

				setTimeout((): void => {
					expect(handleSignOut).not.toHaveBeenCalled()
				})
			})
		})
	})
})
