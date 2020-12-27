import { renderHook, act } from "@testing-library/react-hooks"

import { useRequest } from "../../effects/use-request"

describe("useRequest hook", (): void => {
	const url = "https://url.com/"
	const data = { data: "data" }

	beforeAll((): void => {
		jest
			.spyOn(global, "fetch")
			.mockImplementation(
				() =>
					Promise.resolve({ json: () => Promise.resolve(data) }) as any,
			)
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

			act(() => {
				result.current.start()
			})

			expect(global.fetch).toBeCalledTimes(1)
			expect(result.current.isLoading).toEqual(true)
			await waitForNextUpdate()
			expect(result.current.data).toEqual(data)
			expect(result.current.isLoading).toEqual(false)
		})
	})
})
