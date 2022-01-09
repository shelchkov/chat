import { renderHook } from "@testing-library/react-hooks"

import { useTyping } from "../../effects/use-typing"

jest.mock("../../utils/utils", () => ({
	throttle: (fn: () => void) => fn,
	debounce: (fn: () => void) => fn,
}))

describe("useTyping hook", () => {
	const handleTyping = jest.fn()
	const selectedUserId = 6

	beforeEach(() => {
		handleTyping.mockClear()
	})

	it("calls handleTyping", () => {
		const {
			result: {
				current: { handleChange },
			},
		} = renderHook(() => useTyping(handleTyping, selectedUserId))
		handleChange()

		expect(handleTyping).toBeCalledTimes(2)
		expect(handleTyping.mock.calls[0][0]).toEqual(selectedUserId)
		expect(handleTyping.mock.calls[0][1]).toBeFalsy()
	})

	it("calls handleTyping with isStopping set to true", () => {
		const {
			result: {
				current: { handleChange },
			},
		} = renderHook(() => useTyping(handleTyping, selectedUserId))
		handleChange()

		expect(handleTyping).toBeCalledTimes(2)
		expect(handleTyping.mock.calls[1][0]).toEqual(selectedUserId)
		expect(handleTyping.mock.calls[1][1]).toBeTruthy()
	})

	describe("and selected user isn't provided", () => {
		it("doesn't throw error", () => {
			const {
				result: {
					current: { handleChange },
				},
			} = renderHook(() => useTyping(handleTyping))
			handleChange()

			expect(handleTyping).not.toBeCalled()
		})
	})
})
