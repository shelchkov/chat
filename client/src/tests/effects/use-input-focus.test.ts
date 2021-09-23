import { renderHook } from "@testing-library/react-hooks"

import { useInputFocus } from "../../effects/use-input-focus"

describe("useInputFocus", () => {
	const focus = jest.fn()
	const ref = { current: { focus } } as any

	describe("reference is optional", () => {
		it("doesn't throw error", () => {
			renderHook(() => useInputFocus())
		})
	})

	it("calls focus on passed reference", () => {
		renderHook(() => useInputFocus(ref))
		expect(focus).toBeCalledTimes(1)
	})
})
