import { mount, ReactWrapper } from "enzyme"
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
	const props: Parameters<typeof SendMessageForm>[0] = {
		isLoading: false,
		selectedUserId,
		isMobile: false,
		addMessage,
		handleTyping: jest.fn(),
	}

	const useInputFocusMock = jest.spyOn(useInputFocus, "useInputFocus")

	const register = jest.fn().mockReturnValue(noop)
	const data = { message: "message" }
	const handleSubmit = jest
		.fn()
		.mockImplementation((fn) => () => fn(data))
	const reset = jest.fn()
	jest
		.spyOn(hookForm, "useForm")
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		.mockReturnValue({ register, handleSubmit, reset } as any)

	const start = jest.fn()
	const useRequestSpy = jest
		.spyOn(useRequest, "useRequest")
		.mockReturnValue({ start, isLoading: false, resetData: jest.fn() })

	let component: ReactWrapper<typeof props>

	beforeAll(() => {
		component = mount(<SendMessageForm {...props} />)
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
			component = mount(<SendMessageForm {...props} />)
			const call = useInputFocusMock.mock.calls[0][0]
			expect(call).toBeDefined()
			expect(call).toHaveProperty("current")
		})

		it("doesn't focus input on mobile", () => {
			props.isMobile = true
			component = mount(<SendMessageForm {...props} />)

			expect(useInputFocusMock.mock.calls[0]).toEqual([undefined])
		})
	})

	describe("form submit", () => {
		it("calls start", () => {
			;(component.childAt(0).prop("onSubmit") as () => void)()
			expect(start).toBeCalledWith(
				{ text: data.message },
				`${selectedUserId}`,
			)
			expect(start).toBeCalledTimes(1)
		})

		it("calls addMessage and reset", async () => {
			addMessage.mockClear()
			reset.mockClear()

			const message = { id: 1 }

			start.mockResolvedValue(message)
			useRequestSpy.mockReturnValue({
				start,
				data: message,
				isLoading: false,
				resetData: jest.fn(),
			})
			component = mount(<SendMessageForm {...props} />)

			expect(addMessage).toBeCalledTimes(1)
			expect(addMessage).toBeCalledWith(message)
			expect(reset).toBeCalledTimes(1)
		})
	})
})
