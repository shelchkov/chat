import { act, renderHook } from "@testing-library/react-hooks"

import { useFriends } from "../../effects/use-friends"
import { userMock } from "../tests-utils"

describe("useFriends hook", () => {
	it("friends are optional", () => {
		const {
			result: {
				current: { friends },
			},
		} = renderHook(() => useFriends())
		expect(friends).toEqual([])
	})

	it("adds friend", () => {
		const { result } = renderHook(() => useFriends())
		expect(result.current.friends).toEqual([])

		act(() => {
			result.current.addFriend(userMock)
		})

		expect(result.current.friends).toEqual([userMock])
	})

	describe("and friends list is updated", () => {
		it("resets friends if undefined is passed", () => {
			const { result } = renderHook(() => useFriends())

			act(() => {
				result.current.addFriend(userMock)
			})

			expect(result.current.friends?.length).toEqual(1)

			act(() => {
				result.current.updateUsersList()
			})

			expect(result.current.friends).toEqual([])
		})

		it("empties friends list if null is passed", () => {
			const { result } = renderHook(() => useFriends())

			act(() => {
				result.current.addFriend(userMock)
			})

			expect(result.current.friends?.length).toEqual(1)

			act(() => {
				result.current.updateUsersList(null)
			})

			expect(result.current.friends).toEqual(undefined)
		})

		describe("and array is passed", () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const users = [{ id: 6 }, { id: 7 }] as any

			it("sets friends list", () => {
				const { result } = renderHook(() => useFriends())

				act(() => {
					result.current.updateUsersList(users)
				})

				expect(result.current.friends).toEqual(
					users.map((user: { id: number }) => ({
						...user,
						notFriend: true,
					})),
				)
			})
		})
	})
})
