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

	beforeEach((): void => {
		user = { name: "UserName" }
		mainPage = shallow(<MainPage handleSignOut={noop} user={user} />)
		const close = (): void => {
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
})
