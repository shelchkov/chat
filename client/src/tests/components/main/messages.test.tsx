import { shallow, ShallowWrapper } from "enzyme"
import React from "react"

import { Messages } from "../../../components/main/messages"
import { userMock, userMock2 } from "../../tests-utils"
import * as useWidth from "../../../effects/use-width"
import * as useLatestMessages from "../../../effects/use-latest-messages"
import * as userUtils from "../../../utils/user-utils"
import { MessagesList } from "../../../components/messages/messages-list"
import { UsersList } from "../../../components/users/users-list"

jest.mock("../../../effects/use-width")
jest.mock("../../../effects/use-latest-messages")
jest.mock("../../../utils/user-utils")

describe("Messages component", () => {
	let component: ShallowWrapper
	const props: Parameters<typeof Messages>[0] = {
		friends: [],
		onlineFriends: undefined,
		user: userMock,
		newMessage: undefined,
		updateUsersList: jest.fn(),
		addNewFriend: jest.fn(),
	}

	const updateLatestMessageMock = jest.fn()
	const useWidthMock = jest
		.spyOn(useWidth, "useWidth")
		.mockReturnValue({ width: 1200, isMore: true })
	jest.spyOn(useLatestMessages, "useLatestMessages").mockReturnValue({
		latestMessages: undefined,
		updateLatestMessage: updateLatestMessageMock,
	})
	jest.spyOn(userUtils, "markOnlineUsers").mockReturnValue(undefined)
	jest
		.spyOn(userUtils, "addLatestMessagesToUsers")
		.mockReturnValue(undefined)

	beforeAll(() => {
		component = shallow(<Messages {...props} />)
	})

	describe("when opened on desktop", () => {
		it("renders both UsersList and MessagesList", () => {
			expect(component.find(UsersList).exists()).toBeTruthy()
			expect(component.find(MessagesList).exists()).toBeTruthy()
		})

		it("MessagesList receives handleNewMessage", () => {
			expect(
				component.find(MessagesList).prop("handleNewMessage"),
			).toBe(updateLatestMessageMock)
		})

		describe("and friend was selected", () => {
			beforeAll(() => {
				component.find(UsersList).prop("handleUserSelect")(userMock2)
			})

			it("UsersList receives selectedUserId", () => {
				expect(component.find(UsersList).prop("selectedUserId")).toBe(
					userMock2.id,
				)
			})

			it("MessagesList receives selectedUser", () => {
				expect(component.find(MessagesList).prop("selectedUser")).toBe(
					userMock2,
				)
			})
		})
	})

	describe("when opened on mobile", () => {
		beforeAll(() => {
			useWidthMock.mockReturnValue({ isMore: false, width: 400 })
			component = shallow(<Messages {...props} />)
		})

		afterAll(() => {
			useWidthMock.mockReset()
		})

		it("renders only UsersList initially", () => {
			expect(component.find(UsersList).exists()).toBeTruthy()
			expect(component.find(MessagesList).exists()).toBeFalsy()
		})

		it("UsersList receives isMobile", () => {
			expect(component.find(UsersList).prop("isMobile")).toBeTruthy()
		})

		describe("and friend was selected", () => {
			beforeAll(() => {
				component.find(UsersList).prop("handleUserSelect")(userMock2)
			})

			it("renders only MessagesList", () => {
				expect(component.find(UsersList).exists()).toBeFalsy()
				expect(component.find(MessagesList).exists()).toBeTruthy()
			})

			it("MessagesList receives selectedUser", () => {
				expect(component.find(MessagesList).prop("selectedUser")).toBe(
					userMock2,
				)
			})

			it("MessagesList receives handleNewMessage", () => {
				expect(
					component.find(MessagesList).prop("handleNewMessage"),
				).toBe(updateLatestMessageMock)
			})

			it("MessagesList receives isMobile", () => {
				expect(
					component.find(MessagesList).prop("isMobile"),
				).toBeTruthy()
			})
		})
	})
})
