import { renderHook, act } from "@testing-library/react-hooks"

import { useSockets } from "../../effects/use-sockets"

describe("useSockets hook", (): void => {
	let WebSocketSpy: jest.SpyInstance
	let currentWs: {
		onmessage?: (event: MessageEvent) => void
		onclose?: () => void
	} = {}
	const close = jest.fn()

	beforeAll((): void => {
		WebSocketSpy = jest
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.spyOn(global, "WebSocket" as any)
			.mockImplementation(function () {
				const onclose = (): void => undefined

				const onmessage = (): void => undefined

				const result = {
					onmessage,
					onclose,
					close,
				}

				currentWs = result

				return result
			})
	})

	beforeEach((): void => {
		WebSocketSpy.mockClear()
	})

	describe("when initialized", (): void => {
		it("should create WebSocket connection", (): void => {
			renderHook(() => useSockets())
			expect(WebSocketSpy).toBeCalledTimes(1)
		})
	})

	describe("when receiving new message", (): void => {
		const newMessage = { newMessage: "Message" }

		it("should save received data", async (): Promise<void> => {
			const { result } = renderHook(() => useSockets())

			act((): void => {
				if (currentWs.onmessage) {
					currentWs.onmessage({
						data: JSON.stringify(newMessage),
					} as MessageEvent)
				}
			})

			expect(result.current.data).toEqual(newMessage)
			expect(WebSocketSpy).toBeCalledTimes(1)
			expect(close).toBeCalledTimes(1)
		})
	})

	describe("when connection is closing", (): void => {
		it("should reconnect", async (): Promise<void> => {
			const { waitForNextUpdate } = renderHook(() => useSockets())
			expect(WebSocketSpy).toBeCalledTimes(1)

			act((): void => {
				if (currentWs.onclose) {
					currentWs.onclose()
				}
			})

			expect(close).toBeCalledTimes(2)
			await waitForNextUpdate()
			expect(WebSocketSpy).toBeCalledTimes(2)
		})
	})
})
