import React from "react"
import { shallow } from "enzyme"

import { LoadingPage } from "../../pages/loading.page"

describe("loading page", (): void => {
	it("should render correctly", (): void => {
		const loadingPage = shallow(<LoadingPage />)
		expect(loadingPage).toMatchSnapshot()
	})
})
