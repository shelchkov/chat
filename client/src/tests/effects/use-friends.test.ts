import { act, renderHook } from "@testing-library/react-hooks"

import { useFriends } from "../../effects/use-friends"
import * as userUtils from "../../utils/user-utils"
import { userMock } from "../tests-utils"

jest.mock("../../utils/user-utils", () => {
	const original = jest.requireActual("../../utils/user-utils")

	return { ...original, markNotFriends: jest.fn() }
})

describe("useFriends hook", () => {
	const markNotFriendsSpy = jest.spyOn(userUtils, "markNotFriends")

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

	it("adds online friend", () => {
	  const newFriendId = 5
	  const { result } = renderHook(() => useFriends())

	  act(() => {
	    result.current.addNewOnlineFriend(newFriendId)
	  })

		expect(result.current.onlineFriends).toEqual([newFriendId])
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
			const users = [{ id: 6 }, { id: 7 }] as any

			beforeAll(() => {
				markNotFriendsSpy.mockReturnValue(users)
			})

			it("sets friends list", () => {
	      const { result } = renderHook(() => useFriends())

	      act(() => {
	        result.current.updateUsersList(users)
	      })

				expect(result.current.friends).toEqual(users)
			})
		})
	})
})
