import React from "react"
import { mount, ReactWrapper } from "enzyme"
import { act } from "@testing-library/react"

import { MainPage } from "../../pages/main.page"
import { User } from "../../utils/interfaces"
import { SignOut } from "../../components/main/sign-out"
import { Messages } from "../../components/main/messages"
import * as useSockets from "../../effects/use-sockets"
import * as utils from "../../utils/utils"

jest.mock("../../effects/use-sockets")
jest.mock("react-hook-form", () => ({
	useForm: () => ({
		register: () => jest.fn(),
		handleSubmit: () => jest.fn(),
	}),
}))
jest.mock("../../utils/utils", () => {
	const original = jest.requireActual("../../utils/utils")

	return { ...original, markNotFriends: jest.fn() }
})

describe("main page", (): void => {
	let mainPage: ReactWrapper

	const user = { name: "User Name", friends: [{ id: 2 }] } as User

	const useSocketsSpy = jest
		.spyOn(useSockets, "useSockets")
		.mockReturnValue({} as any)
	const handleSignOut = jest.fn()
	const markNotFriendsSpy = jest.spyOn(utils, "markNotFriends")

	const getFriends = () => mainPage.find(Messages).prop("friends")
	const getOnlineFriends = () =>
		mainPage.find(Messages).prop("onlineFriends")

	beforeEach((): void => {
		mainPage = mount(
			<MainPage handleSignOut={handleSignOut} user={user} />,
		)
	})

	describe("render", (): void => {
		beforeAll(() => {
			useSocketsSpy.mockReturnValue({} as any)
		})

		it("renders user's name", (): void => {
			expect(mainPage.text()).toEqual(expect.stringMatching(user.name))
		})

		it("renders sign out button", (): void => {
			expect(mainPage.find(SignOut).length).toEqual(1)
		})

		it("renders messages list", (): void => {
			expect(mainPage.find(Messages).length).toEqual(1)
		})

		it("passes user's friends list to messages list", (): void => {
			expect(getFriends()).toEqual(user.friends || [])
		})

		it("passes handleSignOut to SignOut", () => {
			expect(mainPage.find(SignOut).prop("handleSignOut")).toEqual(
				handleSignOut,
			)
		})

		it("new message isn't set initially", () => {
			expect(mainPage.prop("newMessage")).toEqual(undefined)
		})
	})

	describe("and receives new message via websocket", (): void => {
		const data = {
			newMessage: { from: (user.friends as User[])[0].id },
		}

		beforeAll(() => {
			useSocketsSpy.mockReturnValue({ data } as any)
			mainPage = mount(
				<MainPage handleSignOut={handleSignOut} user={user} />,
			)
		})

		it("sets new message", () => {
			expect(mainPage.find(Messages).prop("newMessage")).toEqual(
				data.newMessage,
			)
		})

		it("doesn't add new friend", () => {
			expect((getFriends() as User[]).length).toEqual(
				user.friends?.length,
			)
		})

		describe("and user isn't added to friends list", () => {
			beforeAll(() => {
				data.newMessage.from = data.newMessage.from + 1
				useSocketsSpy.mockReturnValue({ data } as any)
				mainPage.update()
			})

			it("creates new friend", () => {
				const friends = getFriends() as User[]
				expect(friends.length).toEqual((user.friends?.length || 0) + 1)
				expect(friends[friends.length - 1]).toHaveProperty(
					"id",
					data.newMessage.from,
				)
				expect(friends[friends.length - 1]).toHaveProperty(
					"isOnline",
					true,
				)
			})

			it("adds new friend to online frineds list", () => {
				expect(((getOnlineFriends() as number[]) || []).length).toEqual(
					1,
				)
			})
		})
	})

	describe("and receives list of online users", () => {
		const data = { online: [{ userId: 4 }] }

		beforeAll(() => {
			useSocketsSpy.mockReturnValue({ data })
			mainPage = mount(
				<MainPage handleSignOut={handleSignOut} user={user} />,
			)
		})

		it("saves online users list", () => {
			const expected = data.online.map(({ userId }): number => userId)
			expect(getOnlineFriends()).toEqual(expected)
		})
	})

	describe("and receives new online friend", () => {
		const data = { newUserOnline: 5 }

		beforeAll(() => {
			useSocketsSpy.mockReturnValue({ data })
			mainPage.update()
		})

		it("adds new id to list of online friends", () => {
			expect(
				(getOnlineFriends() as number[]).indexOf(data.newUserOnline),
			).not.toEqual(-1)
		})
	})

	describe("and friends list is updated", () => {
		const getUpdateUsersList = () =>
			mainPage.find(Messages).prop("updateUsersList")

		beforeAll(() => {
			const data = {
				newMessage: { from: (user.friends as User[])[0].id + 2 },
			}
			useSocketsSpy.mockReturnValue({ data } as any)
			mainPage = mount(
				<MainPage handleSignOut={handleSignOut} user={user} />,
			)
		})

		it("resets friends if undefined is passed", () => {
			expect(getFriends()).not.toEqual(user.friends || [])

			act(getUpdateUsersList())
			mainPage.update()

			expect(getFriends()).toEqual(user.friends || [])
		})

		it("empties friends list if null is passed", () => {
			mainPage = mount(
				<MainPage handleSignOut={handleSignOut} user={user} />,
			)

			act(() => {
				getUpdateUsersList()(null)
			})
			mainPage.update()

			expect(getFriends()).toEqual(undefined)
		})

		describe("and array is passed", () => {
			const users = [{ id: 6 }, { id: 7 }] as any

			beforeAll(() => {
				markNotFriendsSpy.mockReturnValue(users)
				mainPage = mount(
					<MainPage handleSignOut={handleSignOut} user={user} />,
				)
			})

			it("sets friends list", () => {
				act(() => {
					getUpdateUsersList()(users)
				})
				mainPage.update()

				expect(getFriends()).toEqual(users)
			})
		})
	})

	describe("add new friend is added", () => {
		const userId = (user.friends as User[])[0].id + 2

		beforeAll(() => {
			const data = { newMessage: { from: userId } }
			useSocketsSpy.mockReturnValue({ data } as any)
			mainPage = mount(
				<MainPage handleSignOut={handleSignOut} user={user} />,
			)
		})

		it("adds friend to original friends list", () => {
			const addNewFriend = mainPage.find(Messages).prop("addNewFriend")
			expect(
				((mainPage.prop("originalFriends") as User[]) || []).find(
					({ id }) => id === userId,
				),
			).not.toBeDefined()

			act(() => {
				addNewFriend(userId)
			})
			mainPage.update()

			setTimeout(() => {
				expect(
					((mainPage.prop("originalFriends") as User[]) || []).find(
						({ id }) => id === userId,
					),
				).toBeDefined()
			})
		})
	})
})
