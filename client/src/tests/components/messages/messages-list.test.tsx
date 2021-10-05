import { mount, ReactWrapper } from "enzyme"
import React from "react"

import { MessagesList } from "../../../components/messages/messages-list"
import { MessagesListAndForm } from "../../../components/messages/messages-list-and-form"
import * as useRequest from "../../../effects/use-request"
import { messageMock, userMock } from "../../tests-utils"
import * as useMessages from "../../../effects/use-messages"

jest.mock("../../../effects/use-request")
jest.mock("../../../effects/use-messages")
jest.mock("react-hook-form", () => ({
	useForm: () => ({
		register: () => jest.fn(),
		handleSubmit: () => jest.fn(),
	}),
}))

describe("MessagesList component", () => {
	let component: ReactWrapper
	const handleNewMessageMock = jest.fn()
	const addNewFriendMock = jest.fn()
	const props: Parameters<typeof MessagesList>[0] = {
		isSearching: false,
		user: userMock,
		newMessage: undefined,
		addNewFriend: addNewFriendMock,
		handleNewMessage: handleNewMessageMock,
	}

	const addNewMessageMock = jest.fn()
	jest.spyOn(useRequest, "useRequest").mockReturnValue({
		isLoading: false,
		start: jest.fn(),
		resetData: jest.fn(),
	})
	const useMessagesDefault = {
		messages: [],
		isLoading: false,
		addNewMessage: addNewMessageMock,
	}
	const useMessagesMock = jest
		.spyOn(useMessages, "useMessages")
		.mockReturnValue(useMessagesDefault)

	beforeAll(() => {
		component = mount(<MessagesList {...props} />)
	})

	it("renders MessagesListAndForm", () => {
		expect(component.find(MessagesListAndForm).exists()).toBeTruthy()
	})

	it("addMessage calls handleNewMessage", () => {
		component.find(MessagesListAndForm).prop("addMessage")(messageMock)
		expect(handleNewMessageMock).toBeCalledWith(messageMock)
	})

	it("addMessage calls addNewMessage", () => {
		component.find(MessagesListAndForm).prop("addMessage")(messageMock)
		expect(addNewMessageMock).toBeCalledWith(messageMock)
	})

	describe("and new message is passed", () => {
		beforeAll(() => {
			;(props.newMessage = messageMock),
				(props.selectedUser = {
					...userMock,
					id: props.newMessage.from,
				})
			props.handleNewMessage = undefined
			addNewMessageMock.mockClear()
			component = mount(<MessagesList {...props} />)
		})

		it("calls addNewMessage", () => {
			expect(addNewMessageMock).toBeCalledWith(props.newMessage)
		})
	})

	describe("and selected user is not a friend", () => {
		beforeAll(() => {
			useMessagesMock.mockReturnValue({
				...useMessagesDefault,
				messages: undefined,
			})
			addNewFriendMock.mockClear()
			component = mount(<MessagesList {...props} />)
		})

		it("addMessage calls addNewFriend", () => {
			component.find(MessagesListAndForm).prop("addMessage")(
				messageMock,
			)
			expect(addNewFriendMock).toBeCalledWith(messageMock.to)
		})
	})
})
