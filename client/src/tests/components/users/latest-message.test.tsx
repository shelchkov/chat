import { shallow, ShallowWrapper } from "enzyme"
import React from "react"

import { LatestMessage } from "../../../components/users/latest-message"
import { messageMock } from "../../tests-utils"

describe("LatestMessage Component", () => {
	let component: ShallowWrapper
	const props: Parameters<typeof LatestMessage>[0] = {
		latestMessage: undefined,
		userId: 1,
	}

	beforeAll(() => {
		component = shallow(<LatestMessage {...props} />)
	})

	it("doesn't render text if latest message isn't passed", () => {
		expect(component.text()).toEqual("")
	})

	describe("and latest message is passed", () => {
		const message = messageMock
		const userId = message.to + 1

		beforeAll(() => {
			props.latestMessage = message
			props.userId = userId
			component = shallow(<LatestMessage {...props} />)
		})

		it("renders message's text", () => {
			expect(component.text().includes(message.text)).toBeTruthy()
		})

		it("doesn't signal that that's user's message", () => {
			expect(component.text().includes("You:")).toBeFalsy()
		})

		describe("and message is created by user", () => {
			const userId = message.to

			beforeAll(() => {
				props.userId = userId
				component = shallow(<LatestMessage {...props} />)
			})

			it("signals that user is the author of the message", () => {
				expect(component.text().includes("You:")).toBeTruthy()
			})
		})
	})
})
