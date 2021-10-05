import { renderHook } from "@testing-library/react-hooks"

import { useFriends } from "../../effects/use-friends"
// import * as userUtils from "../../utils/user-utils"
// import { userMock } from "../tests-utils"

jest.mock("../../utils/user-utils", () => {
	const original = jest.requireActual("../../utils/user-utils")

	return { ...original, markNotFriends: jest.fn() }
})

describe("useFriends hook", () => {
	// const markNotFriendsSpy = jest.spyOn(userUtils, "markNotFriends")

	it("friends are optional", () => {
		const {
			result: {
				current: { friends },
			},
		} = renderHook(() => useFriends())
		expect(friends).toEqual([])
	})

	// it("adds friend", () => {
	//   const { result: { current: { addFriend, friends } } } = renderHook(() => useFriends())
	//   expect(friends).toEqual([])

	//   act(() => {
	//     addFriend(userMock)
	//   })

	//   setTimeout(() => {
	//     expect(friends).toEqual([userMock])
	//   })
	// })

	// it("adds online friend", () => {
	//   const newFriendId = 5
	//   const { result: { current: { addNewOnlineFriend, onlineFriends } } } = renderHook(() => useFriends())

	//   act(() => {
	//     addNewOnlineFriend(newFriendId)
	//   })

	//   setTimeout(() => {
	//     expect(onlineFriends).toEqual([newFriendId])
	//   })
	// })

	// describe("and friends list is updated", () => {
	// 	it("resets friends if undefined is passed", () => {
	//     const { result: { current: { updateUsersList, friends, addFriend } } } = renderHook(() => useFriends())

	//     act(() => {
	//       addFriend(userMock)
	//     })

	//     setTimeout(() => {
	//       expect(friends?.length).toEqual(1)
	//     })

	//     act(() => {
	//       updateUsersList()
	//     })

	// 		expect(friends).toEqual([])
	// 	})

	// 	it("empties friends list if null is passed", () => {
	//     const { result: { current: { updateUsersList, friends, addFriend } } } = renderHook(() => useFriends())

	//     act(() => {
	//       addFriend(userMock)
	//     })

	//     setTimeout(() => {
	//       expect(friends?.length).toEqual(1)
	//     })

	//     act(() => {
	//       updateUsersList(null)
	//     })

	// 		setTimeout(() => {
	//       expect(friends).toEqual(undefined)
	//     })
	// 	})

	// 	describe("and array is passed", () => {
	// 		const users = [{ id: 6 }, { id: 7 }] as any

	// 		beforeAll(() => {
	// 			markNotFriendsSpy.mockReturnValue(users)
	// 		})

	// 		it("sets friends list", () => {
	//       const { result: { current: { updateUsersList, friends } } } = renderHook(() => useFriends())

	//       act(() => {
	//         updateUsersList(users)
	//       })

	//       setTimeout(() => {
	//         expect(friends).toEqual(users)
	//       })
	// 		})
	// 	})
	// })
})
