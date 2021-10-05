import { shallow, ShallowWrapper } from "enzyme"
import React from "react"

import { LatestMessage } from "../../../components/users/latest-message"
import { UserCard } from "../../../components/users/user-card"
import { userMock } from "../../tests-utils"

describe("UserCard component", () => {
	let component: ShallowWrapper
	const handleUserSelectMock = jest.fn()
	const user = userMock
	const props: Parameters<typeof UserCard>[0] = {
		user,
		isSelected: false,
		handleUserSelect: handleUserSelectMock,
	}

	beforeAll(() => {
		component = shallow(<UserCard {...props} />)
	})

	it("renders LatestMessage", () => {
		expect(component.find(LatestMessage).exists()).toBeTruthy()
	})

	it("handles click", () => {
		component.dive().simulate("click")
		expect(handleUserSelectMock).toBeCalledWith(user)
	})

	it("renders user name", () => {
		expect(component.text().includes(user.name)).toBeTruthy()
	})
})
