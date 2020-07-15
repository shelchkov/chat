import React, { ReactElement } from "react"
import styled from "styled-components"

import { Input } from "../input/input"
import { Button } from "../button/button"

const Form = styled.form`
	display: flex;
`

export const AddFriendForm = (): ReactElement => {
	return (
		<Form>
			<Input
				name="addFriend"
				placeholder="Search Users"
				isAddFriendForm
			/>
			<Button text="Search" isAddFriendForm />
		</Form>
	)
}
