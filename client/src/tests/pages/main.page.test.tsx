import React from "react"
import { mount, ReactWrapper } from "enzyme"

import { MainPage } from "../../pages/main.page"
import { User } from "../../utils/interfaces"
import { SignOut } from "../../components/main/sign-out"
import { Messages } from "../../components/main/messages"
import * as useLatestMessages from "../../effects/use-latest-messages"
import * as useFriends from "../../effects/use-friends"
import * as useUserSockets from "../../effects/use-user-sockets"
import * as useArrayState from "../../effects/use-array-state"

jest.mock("react-hook-form", () => ({
	useForm: () => ({
		register: () => jest.fn(),
		handleSubmit: () => jest.fn(),
	}),
}))
jest.mock("../../utils/user-utils", () => {
	const original = jest.requireActual("../../utils/user-utils")

	return { ...original, markNotFriends: jest.fn() }
})
jest.mock("../../effects/use-latest-messages")
jest.mock("../../effects/use-friends")
jest.mock("../../effects/use-user-sockets")
jest.mock("../../effects/use-array-state")

describe("main page", (): void => {
	let mainPage: ReactWrapper

	const user = { name: "User Name", friends: [{ id: 2 }] } as User
	const handleSignOut = jest.fn()

	const getFriends = () => mainPage.find(Messages).prop("friends")

	jest.spyOn(useLatestMessages, "useLatestMessages").mockReturnValue({
		updateLatestMessage: jest.fn(),
		latestMessages: undefined,
	})
	jest.spyOn(useFriends, "useFriends").mockReturnValue({
		friends: [],
		addFriend: jest.fn(),
		updateUsersList: jest.fn(),
		addNewFriend: jest.fn(),
	})
	jest
		.spyOn(useUserSockets, "useUserSockets")
		.mockReturnValue({ newMessage: undefined })
	jest
		.spyOn(useArrayState, "useArrayState")
		.mockReturnValue([undefined, jest.fn(), jest.fn(), jest.fn()])

	beforeEach((): void => {
		mainPage = mount(
			<MainPage handleSignOut={handleSignOut} user={user} />,
		)
	})

	describe("render", (): void => {
		it("renders user's name", (): void => {
			expect(mainPage.text()).toEqual(expect.stringMatching(user.name))
		})

		it("renders sign out button", (): void => {
			expect(mainPage.find(SignOut).exists()).toBeTruthy()
		})

		it("renders messages list", (): void => {
			expect(mainPage.find(Messages).exists()).toBeTruthy()
		})

		it("passes handleSignOut to SignOut", () => {
			expect(mainPage.find(SignOut).prop("handleSignOut")).toEqual(
				handleSignOut,
			)
		})

		it("new message isn't set initially", () => {
			expect(mainPage.prop("newMessage")).toEqual(undefined)
		})

		it("passes empty array of friends to Messages", () => {
			expect(getFriends()).toEqual([])
		})
	})
})
