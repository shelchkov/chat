import React, { ReactElement, useEffect, ChangeEvent } from "react"
import styled from "styled-components"
import { useRequest } from "../../effects/use-request"
import { useForm } from "react-hook-form"

import { Input } from "../input/input"
import { Button } from "../button/button"

import { getUsersSearchInput } from "../../utils/api-utils"
import { ButtonTypes } from "../../utils/enums"
import { User } from "../../utils/interfaces"

interface Props {
	updateUsersList: (users?: User[] | null) => void
	setIsSearching: (isSearching: boolean) => void
}

const Form = styled.form`
	display: flex;
`

interface Inputs {
	addFriend: string
}

export const AddFriendForm = ({
	updateUsersList,
	setIsSearching,
}: Props): ReactElement => {
	const { register, handleSubmit } = useForm<Inputs>()
	const { data, start } = useRequest(getUsersSearchInput())

	const onSubmit = (data: Inputs): void => {
		start(undefined, data.addFriend)
		setIsSearching(true)
		updateUsersList(null)
	}

	useEffect((): void => {
		data && updateUsersList(data)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const handleEmptyInput = (
		event: ChangeEvent<HTMLInputElement>,
	): void => {
		const value = event.currentTarget.value

		if (!value) {
			updateUsersList()
			setIsSearching(false)
		}
	}

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<Input
				name="addFriend"
				placeholder="Search Users"
				isAddFriendForm
				reference={register({ required: true })}
				onChange={handleEmptyInput}
			/>
			<Button text="Search" isMessagesPage type={ButtonTypes.SUBMIT} />
		</Form>
	)
}
