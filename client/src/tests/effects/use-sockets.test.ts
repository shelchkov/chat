import { renderHook, act } from "@testing-library/react-hooks"

import { useSockets } from "../../effects/use-sockets"

describe("useSockets hook", (): void => {
	let WebSocketSpy: jest.SpyInstance
	let currentWs: { onmessage?: (event: MessageEvent) => void } = {}
	const close = jest.fn()

	beforeAll((): void => {
		WebSocketSpy = jest
			.spyOn(global, "WebSocket" as any)
			.mockImplementation(function (url: string) {
				const onclose = (): void => undefined

				const onmessage = (event: MessageEvent): void => undefined

				const result = {
					onmessage,
					onclose,
					close,
				}

				currentWs = result

				return result
			} as any)
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
})
