import { shallow, ShallowWrapper } from "enzyme"
import React from "react"
import { MessagesList } from "../../../components/messages/messages-list"
import { MessagesListAndForm } from "../../../components/messages/messages-list-and-form"
import * as useRequest from "../../../effects/use-request"
import { messageMock } from "../../tests-utils"

jest.mock("../../../effects/use-request")

describe('MessagesList component', () => {
  let component: ShallowWrapper
  const handleNewMessageMock = jest.fn()
  const props: Parameters<typeof MessagesList>[0] = {
    isSearching: false,
    user: undefined,
    newMessage: undefined,
    addNewFriend: jest.fn(),
    handleNewMessage: handleNewMessageMock,
  }

  jest.spyOn(useRequest, "useRequest").mockReturnValue({ isLoading: false, start: jest.fn(), resetData: jest.fn() })

  beforeAll(() => {
    component = shallow(<MessagesList {...props} />)
  })

  it("renders MessagesListAndForm", () => {
    expect(component.find(MessagesListAndForm).exists()).toBeTruthy()
  })
  
  it("addMessage calls handleNewMessage", () => {
    component.find(MessagesListAndForm).prop("addMessage")(messageMock)
    expect(handleNewMessageMock).toBeCalledWith(messageMock)
  })
})
