import { renderHook, act } from "@testing-library/react-hooks"

import { useWidth } from "../../effects/use-width"

describe("useWidth hook", (): void => {
	const originalWidth = global.innerWidth
	const width = originalWidth - 24

	const resize = (width: number): void => {
		global.innerWidth = width
		act((): void => {
			global.dispatchEvent(new Event("resize"))
		})
	}

	const reset = (): void => {
		global.innerWidth = originalWidth
	}

	it("shouldn't throw an error", (): void => {
		renderHook(() => useWidth())
	})

	describe("when called", (): void => {
		it("should return current width of correct type", (): void => {
			const { result } = renderHook(() => useWidth())
			expect(result.current.width).toEqual(expect.any(Number))
		})

		it("should take width from window object", (): void => {
			global.innerWidth = width
			const { result } = renderHook(() => useWidth())
			expect(result.current.width).toEqual(width)
			reset()
		})

		it("shouldn't return isMore, if breakpoint wasn't passed", (): void => {
			const { result } = renderHook(() => useWidth())
			expect(result.current.isMore).toEqual(undefined)
		})

		it("should return isMore, if breakpoint was passed", (): void => {
			const breakpoint = originalWidth - 1
			const { result } = renderHook(() => useWidth(breakpoint))
			expect(result.current.isMore).toEqual(true)
		})
	})

	describe("when screen resizes", (): void => {
		it("should return new width", (): void => {
			const { result } = renderHook(() => useWidth())

			expect(result.current.width).not.toEqual(width)
			resize(width)
			expect(result.current.width).toEqual(width)

			reset()
		})

		it("should recalculate isMore", (): void => {
			const breakpoint = originalWidth + 1
			const newWidth = breakpoint + 1
			const { result } = renderHook(() => useWidth(breakpoint))

			expect(result.current.isMore).toEqual(false)
			resize(newWidth)
			expect(result.current.isMore).toEqual(true)

			reset()
		})
	})
})
