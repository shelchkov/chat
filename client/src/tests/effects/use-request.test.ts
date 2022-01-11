import { renderHook, act } from "@testing-library/react-hooks"

import { useRequest } from "../../effects/use-request"

describe("useRequest hook", (): void => {
	const url = "https://url.com/"
	const data = { data: "data" }
	let fetchSpy: jest.SpyInstance

	beforeEach((): void => {
		fetchSpy = jest.spyOn(global, "fetch").mockImplementation(
			() =>
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				Promise.resolve({ json: () => Promise.resolve(data) }) as any,
		)
	})

	afterEach((): void => {
		fetchSpy.mockClear()
	})

	describe("when initialized", (): void => {
		it("shouldn't call fetch", (): void => {
			const { result } = renderHook(() => useRequest({ url }))

			expect(global.fetch).toBeCalledTimes(0)
			expect(result.current.data).toEqual(undefined)
			expect(result.current.error).toEqual(undefined)
			expect(result.current.isLoading).toEqual(false)
		})
	})

	describe("when start is called", (): void => {
		it("should call fetch", async (): Promise<void> => {
			const { result, waitForNextUpdate } = renderHook(() =>
				useRequest({ url }),
			)

			act((): void => {
				result.current.start()
			})

			expect(global.fetch).toBeCalledTimes(1)
			expect(result.current.isLoading).toEqual(true)
			await waitForNextUpdate()
			expect(result.current.data).toEqual(data)
			expect(result.current.isLoading).toEqual(false)
			expect(result.current.error).toEqual(undefined)
		})
	})

	describe("when resetData is called", (): void => {
		it("should reset data", async (): Promise<void> => {
			const { result, waitForNextUpdate } = renderHook(() =>
				useRequest({ url }),
			)

			act((): void => {
				result.current.start()
			})

			await waitForNextUpdate()
			expect(result.current.data).toEqual(data)

			act((): void => {
				result.current.resetData()
			})

			expect(result.current.data).toEqual(undefined)
			expect(result.current.isLoading).toEqual(false)
			expect(result.current.error).toEqual(undefined)
			expect(global.fetch).toBeCalledTimes(1)
		})
	})

	describe("when error is thrown", (): void => {
		const errorMessage = "Error message"

		beforeEach((): void => {
			fetchSpy.mockImplementation(() =>
				Promise.reject({ message: errorMessage }),
			)
		})

		it("should save error message", async (): Promise<void> => {
			const { result, waitForNextUpdate } = renderHook(() =>
				useRequest({ url }),
			)

			act((): void => {
				result.current.start()
			})

			expect(result.current.isLoading).toEqual(true)
			await waitForNextUpdate()
			expect(result.current.error).toEqual(errorMessage)
			expect(result.current.isLoading).toEqual(false)
			expect(result.current.data).toEqual(undefined)
			expect(global.fetch).toBeCalledTimes(1)
		})
	})

	describe("when start called two times in a row", (): void => {
		it("should call fetch only once", async (): Promise<void> => {
			const { result, waitForNextUpdate } = renderHook(() =>
				useRequest({ url }),
			)

			act((): void => {
				result.current.start()
			})

			expect(result.current.isLoading).toEqual(true)

			act((): void => {
				result.current.start()
			})

			await waitForNextUpdate()
			expect(global.fetch).toBeCalledTimes(1)
			expect(result.current.data).toEqual(data)
		})
	})
})
