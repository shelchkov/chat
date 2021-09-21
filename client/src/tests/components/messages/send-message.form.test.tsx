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
  const reset = jest.fn()
	jest
		.spyOn(hookForm, "useForm")
		.mockReturnValue({ register, handleSubmit, reset } as any)

	const start = jest.fn()
	const useRequestSpy = jest.spyOn(useRequest, "useRequest").mockReturnValue({ start } as any)

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

	describe("form submit", () => {
    it("calls start", () => {
      ;(component.dive().prop("onSubmit") as () => void)()
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
      useRequestSpy.mockReturnValue({ start, data: message } as any)
      component = shallow(<SendMessageForm {...props} />)

      setTimeout(() => {
        expect(addMessage).toBeCalledTimes(1)
        expect(addMessage).toBeCalledWith(message)
        expect(reset).toBeCalledTimes(1)
      })
    })
	})
})
