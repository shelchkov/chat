import React from "react"
import { ErrorPage } from "../../pages/error.page"
import { shallow } from "enzyme"
import { somethingWentWrong } from "../../utils/utils"
import { LoadingContainer } from "../../pages/loading.page"

describe("error page", (): void => {
	it("contains a container with an error message", (): void => {
		const errorPage = shallow(<ErrorPage />)
		expect(errorPage.text()).toEqual(somethingWentWrong)
		expect(errorPage.find(LoadingContainer).length).toEqual(1)
	})
})
