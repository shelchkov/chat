import { shallow, ShallowWrapper } from "enzyme"
import React from "react"
import * as hookForm from "react-hook-form"

import { SendMessageForm } from "../../../components/messages/send-message.form"
import * as useInputFocus from "../../../effects/use-input-focus"
import { noop } from "../../../utils/utils"
import * as useRequest from "../../../effects/use-request"
import { Input } from "../../../components/input/input"

jest.mock("../../../effects/use-input-focus")
jest.mock("react-hook-form")
jest.mock("../../../effects/use-request")

describe("SendMessageForm", () => {
	const addMessage = jest.fn()

	const selectedUserId = 1
	const props = {
		isLoading: false,
		selectedUserId,
		isMobile: false,
		addMessage,
	}

	const useInputFocusMock = jest.spyOn(useInputFocus, "useInputFocus")

	const register = jest.fn().mockReturnValue(noop)
	const data = { message: "message" }
	const handleSubmit = jest
		.fn()
		.mockImplementation((fn) => () => fn(data))
	jest
		.spyOn(hookForm, "useForm")
		.mockReturnValue({ register, handleSubmit } as any)

	const start = jest.fn()
	jest.spyOn(useRequest, "useRequest").mockReturnValue({ start } as any)

	let component: ShallowWrapper<typeof props>

	beforeAll(() => {
		component = shallow(<SendMessageForm {...props} />)
	})

	describe("Components render", () => {
		it("renders input", () => {
			expect(component.find(Input).exists()).toBeTruthy()
		})
	})

	describe("Input focuses after render", () => {
		beforeEach(() => {
			useInputFocusMock.mockClear()
		})

		it("focuses input", () => {
			component = shallow(<SendMessageForm {...props} />)
			const call = useInputFocusMock.mock.calls[0][0]
			expect(call).toBeDefined()
			expect(call).toHaveProperty("current")
		})

		it("doesn't focus input on mobile", () => {
			props.isMobile = true
			component = shallow(<SendMessageForm {...props} />)

			expect(useInputFocusMock.mock.calls[0]).toEqual([undefined])
		})
	})

	it("form submits", () => {
		;(component.dive().prop("onSubmit") as () => void)()
		expect(start).toBeCalledWith(
			{ text: data.message },
			`${selectedUserId}`,
		)
		expect(start).toBeCalledTimes(1)
	})
})
