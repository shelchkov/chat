import { debounce, throttle } from "../../utils/utils"

describe("utils", () => {
	describe("throttle function", () => {
		const fn = jest.fn()
		const delay = 1

		beforeEach(() => {
			fn.mockClear()
		})

		it("returns function that calls passed function", () => {
			const throttledFn = throttle(fn, delay)
			throttledFn()
			expect(fn).toBeCalledTimes(1)
		})

		it("doesn't call function second time until delay", () => {
			const throttledFn = throttle(fn, delay)
			throttledFn()
			throttledFn()
			expect(fn).toBeCalledTimes(1)
		})

		describe("and setTimeout calls function", () => {
			let timedFn = jest.fn()
			const setTimeoutMock = jest.fn().mockImplementation((fn) => {
				timedFn = fn
			})
			const setTimeoutOg = window.setTimeout

			beforeAll(() => {
				window.setTimeout = setTimeoutMock as any
			})

			afterAll(() => {
				window.setTimeout = setTimeoutOg
			})

			it("calls function after delay", () => {
				const throttledFn = throttle(fn, delay)
				throttledFn()
				expect(fn).toBeCalledTimes(1)
				throttledFn()
				expect(fn).toBeCalledTimes(1)
				timedFn()
				throttledFn()
				expect(fn).toBeCalledTimes(2)
			})
		})
	})

	describe("debounce function", () => {
		const fn = jest.fn()
		const delay = 1

		beforeEach(() => {
			fn.mockClear()
		})

		it("doesn't call passed function", () => {
			const debouncedFn = debounce(fn, delay)
			debouncedFn()
			expect(fn).not.toBeCalled()
		})

		describe("and setTimeout calls function", () => {
			let timedFn = jest.fn()
			const setTimeoutMock = jest.fn().mockImplementation((fn) => {
				timedFn = fn

				return 1
			})
			const setTimeoutOg = window.setTimeout

			beforeAll(() => {
				window.setTimeout = setTimeoutMock as any
			})

			afterAll(() => {
				window.setTimeout = setTimeoutOg
			})

			it("calls passed function after delay", () => {
				const debouncedFn = debounce(fn, delay)
				debouncedFn()
				timedFn()
				expect(fn).toBeCalledTimes(1)
				debouncedFn()
				expect(fn).toBeCalledTimes(1)
			})
		})
	})
})
