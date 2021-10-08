import { act, renderHook } from "@testing-library/react-hooks"

import { useLatestMessages } from "../../effects/use-latest-messages"
import * as useRequest from "../../effects/use-request"
import { messageMock } from "../tests-utils"
import * as userUtils from "../../utils/user-utils"

jest.mock("../../effects/use-request")
jest.mock("../../utils/user-utils")

describe("useLatestMessages hook", () => {
	const startMock = jest.fn()
	const useRequestMockDefault = {
		start: startMock,
		data: undefined,
		resetData: jest.fn(),
		isLoading: false,
	}
	const useRequestSpy = jest
		.spyOn(useRequest, "useRequest")
		.mockReturnValue(useRequestMockDefault)
	jest.spyOn(userUtils, "getUpdatedLatestMessages").mockReturnValue([])

	it("sends request", () => {
		renderHook(() => useLatestMessages())
		expect(startMock).toBeCalledTimes(1)
	})

	describe("and server response is received", () => {
		const data = [messageMock]

		beforeAll(() => {
			useRequestSpy.mockReturnValue({ ...useRequestMockDefault, data })
		})

		it("returns received messages", async () => {
		  const { result } = renderHook(() => useLatestMessages())
			expect(result.current.latestMessages).toEqual(data)
		})

		it("updates latest messages", async () => {
		  const { result } = renderHook(() => useLatestMessages())

		  act(() => {
		    result.current.updateLatestMessage(messageMock)
		  })

			expect(result.current.latestMessages).toEqual([])
		})
	})
})
