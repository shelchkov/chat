import { act, renderHook } from "@testing-library/react-hooks"

import { useMessages } from "../../effects/use-messages"
import * as useRequest from "../../effects/use-request"
import { messageMock, userMock, userMock2 } from "../tests-utils"
import * as userUtils from "../../utils/user-utils"

jest.mock("../../effects/use-request")
jest.mock("../../utils/user-utils")

describe("useMessages hook", () => {
	const startMock = jest.fn()
	const useRequestDefault = {
		start: startMock,
		data: undefined,
		isLoading: false,
		error: undefined,
		resetData: jest.fn(),
	}
	const useRequestMock = jest
		.spyOn(useRequest, "useRequest")
		.mockReturnValue(useRequestDefault)
	const findFriendMock = jest
		.spyOn(userUtils, "findFriend")
		.mockReturnValue(undefined)

	let isSearching = false
	const user = undefined

	it("doesn't call start", () => {
		renderHook(() => useMessages(isSearching, user))
		expect(startMock).not.toBeCalled()
	})

	describe("and selected user is passed", () => {
		const selectedUser = userMock

		it("sends request", () => {
			renderHook(() => useMessages(isSearching, user, selectedUser))
			expect(startMock).toBeCalledWith(undefined, `${selectedUser.id}`)
		})

		describe("and searching", () => {
			beforeAll(() => {
				isSearching = true
			})

			it("doesn't send request", () => {
				startMock.mockReset()
				renderHook(() => useMessages(isSearching, user, selectedUser))
				expect(startMock).not.toBeCalled()
			})

			describe("and selected user is a friend", () => {
				beforeAll(() => {
					findFriendMock.mockReturnValue(userMock2)
				})

				it("sends request", () => {
					startMock.mockReset()
					renderHook(() => useMessages(isSearching, user, selectedUser))
					expect(startMock).toBeCalledWith(
						undefined,
						`${selectedUser.id}`,
					)
				})
			})
		})
	})

	describe("and data is received from server", () => {
		const messages = [messageMock]

		beforeAll(() => {
			useRequestMock.mockReturnValue({
				...useRequestDefault,
				data: messages,
			})
		})

		it("returns messages", () => {
			const {
				result: { current },
			} = renderHook(() => useMessages(isSearching, user))
			expect(current.messages).toEqual(messages)
		})
	})

	describe("and server returns error", () => {
		beforeAll(() => {
			useRequestMock.mockReturnValue({
				...useRequestDefault,
				data: { statusCode: 404 },
			})
		})

		it("resets messages", () => {
			const {
				result: { current },
			} = renderHook(() => useMessages(isSearching, user))
			expect(current.messages).toEqual(undefined)
		})
	})

	it("adds new message", async () => {
	  const message = messageMock
	  const { result } = renderHook(() => useMessages(isSearching, user))

	  act(() => {
	    result.current.addNewMessage(message)
	  })

		expect(result.current.messages?.find(({ id }) => id === message.id)).toBeDefined()
	})
})
