import { renderHook } from "@testing-library/react-hooks"

import * as useSockets from "../../effects/use-sockets"
import { useUserSockets } from "../../effects/use-user-sockets"
import { User } from "../../utils/interfaces"
import { userMock } from "../tests-utils"

jest.mock("../../effects/use-sockets")

describe("userUserSockets hook", () => {
	const useSocketsSpy = jest
		.spyOn(useSockets, "useSockets")
		.mockReturnValue({} as any)

	const friends = [userMock]
	const addNewFriendSpy = jest.fn()
	const addNewOnlineFriendSpy = jest.fn()
	const setOnlineFriendsSpy = jest.fn()

	it("doesn't run functions initially", () => {
		const { result } = renderHook(() =>
			useUserSockets(
				friends,
				addNewFriendSpy,
				addNewOnlineFriendSpy,
				setOnlineFriendsSpy,
			),
		)

		expect(result.current.newMessage).toEqual(undefined)
		expect(addNewFriendSpy).not.toBeCalled()
		expect(addNewOnlineFriendSpy).not.toBeCalled()
		expect(setOnlineFriendsSpy).not.toBeCalled()
	})

	describe("and receives new message via websocket", (): void => {
		const data = {
			newMessage: { from: (friends as User[])[0].id },
		}

		beforeAll(() => {
			useSocketsSpy.mockReturnValue({ data } as any)
		})

		it("sets new message", () => {
			const {
				result: {
					current: { newMessage },
				},
			} = renderHook(() =>
				useUserSockets(
					friends,
					addNewFriendSpy,
					addNewOnlineFriendSpy,
					setOnlineFriendsSpy,
				),
			)
			expect(newMessage).toEqual(data.newMessage)
		})

		it("doesn't add new friend", () => {
			addNewFriendSpy.mockClear()
			renderHook(() =>
				useUserSockets(
					friends,
					addNewFriendSpy,
					addNewOnlineFriendSpy,
					setOnlineFriendsSpy,
				),
			)
			expect(addNewFriendSpy).not.toBeCalled()
		})

		describe("and user isn't added to friends list", () => {
			beforeAll(() => {
				data.newMessage.from = data.newMessage.from + 1
				useSocketsSpy.mockReturnValue({ data } as any)
			})

			it("creates new friend", () => {
				addNewFriendSpy.mockClear()
				renderHook(() =>
					useUserSockets(
						friends,
						addNewFriendSpy,
						addNewOnlineFriendSpy,
						setOnlineFriendsSpy,
					),
				)
				expect(addNewFriendSpy).toBeCalled()
				expect(addNewFriendSpy.mock.calls[0][0]).toHaveProperty(
					"id",
					data.newMessage.from,
				)
				expect(addNewFriendSpy.mock.calls[0][0]).toHaveProperty(
					"isOnline",
					true,
				)
			})

			it("adds new friend to online friends list", () => {
				addNewOnlineFriendSpy.mockClear()
				renderHook(() =>
					useUserSockets(
						friends,
						addNewFriendSpy,
						addNewOnlineFriendSpy,
						setOnlineFriendsSpy,
					),
				)
				expect(addNewOnlineFriendSpy).toBeCalledWith(
					data.newMessage.from,
				)
			})
		})
	})

	describe("and receives list of online users", () => {
		const data = { online: [{ userId: 4 }] }

		beforeAll(() => {
			useSocketsSpy.mockReturnValue({ data })
		})

		it("saves online users list", () => {
			setOnlineFriendsSpy.mockClear()
			renderHook(() =>
				useUserSockets(
					friends,
					addNewFriendSpy,
					addNewOnlineFriendSpy,
					setOnlineFriendsSpy,
				),
			)
			expect(setOnlineFriendsSpy).toBeCalledWith(
				data.online.map(({ userId }): number => userId),
			)
		})
	})

	describe("and receives new online friend", () => {
		const data = { newUserOnline: 5 }

		beforeAll(() => {
			useSocketsSpy.mockReturnValue({ data })
		})

		it("adds new id to list of online friends", () => {
			addNewOnlineFriendSpy.mockClear()
			renderHook(() =>
				useUserSockets(
					friends,
					addNewFriendSpy,
					addNewOnlineFriendSpy,
					setOnlineFriendsSpy,
				),
			)
			expect(addNewOnlineFriendSpy).toBeCalledWith(data.newUserOnline)
		})
	})
})
