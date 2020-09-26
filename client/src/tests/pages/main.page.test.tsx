import React from "react"
import { shallow } from "enzyme"

import { MainPage } from "../../pages/main.page"
import { noop } from "../../utils/utils"
import { User } from "../../utils/interfaces"
import { SignOut } from "../../components/main/sign-out"
import { Messages } from "../../components/main/messages"

describe("main page", (): void => {
	let mainPage
	let user: Partial<User>
	let webSocket: jest.Mock
	let close: jest.Mock

	beforeEach((): void => {
		user = { name: "UserName" }
		mainPage = shallow(<MainPage handleSignOut={noop} user={user} />)
		close = (): void => {
			console.log("Close ws")
		}
		webSocket = jest.fn().mockImplementation(() => ({ close }))
		global.WebSocket = webSocket
	})

	describe("renders passed data", (): void => {
		it("should render user's name", (): void => {
			expect(mainPage.text()).toEqual(expect.stringMatching(user.name))
		})

		it("should render sign out button", (): void => {
			expect(mainPage.find(SignOut).length).toEqual(1)
		})

		it("should render messages list", (): void => {
			expect(mainPage.find(Messages).length).toEqual(1)
		})

		it("should pass user's friends list to messages list", (): void => {
			expect(mainPage.find(Messages).prop("friends")).toEqual(
				user.friends || [],
			)
		})

		it("should create websocket connection", (): void => {
			const wsSpy = jest.spyOn(global, "WebSocket")
			setTimeout((): void => {
				expect(wsSpy).toBeCalled()
			})
		})
	})

	describe("and websocket receives new data", (): void => {
		it("should pass new message", (): void => {
			const newMessage = { id: 0, text: "Message text", from: 1, to: 0 }
			expect(mainPage.prop("newMessage")).toEqual(undefined)

			setTimeout((): void => {
				webSocket.invoke("onmessage")({ data: newMessage })

				const props = mainPage.props()
				const sender = props.friends.find(
					(friend) => friend.id === newMessage.from,
				)

				expect(props.newMessage).toEqual(newMessage)

				if (
					!user.friends.find(
						(friend): boolean => friend.id === newMessage.from,
					)
				) {
					expect(props.friends.length).toEqual(user.friends.length + 1)
					user.friends.push(sender)
				} else {
					expect(props.friends.length).toEqual(user.friends.length)
				}

				expect(sender).toBeDefined()
				expect(sender.isOnline).toEqual(true)

				expect(
					props.onlineFriends.indexOf(newMessage.from),
				).not.toEqual(-1)
			})
		})

		it("should pass online frineds list", (): void => {
			const online = [{ userId: 2 }]
			const expected = online.map(({ userId }): number => userId)

			setTimeout((): void => {
				webSocket.invoke("onmessage")({ data: online })
				expect(mainPage.prop("onlineFriends")).toStrictEqual(expected)
			})
		})

		it("should pass new online user", (): void => {
			const newOnlineUser = 3

			setTimeout((): void => {
				webSocket.invoke("newMessage")({ data: newOnlineUser })
				expect(
					mainPage.prop("onlineFriends").indexOf(newOnlineUser),
				).not.toEqual(-1)
			})
		})
	})
})
