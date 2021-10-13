import React from "react"
import styled from "styled-components"

import { Message } from "../../utils/interfaces"

interface Props {
	latestMessage: Message | undefined
	userId: number
}

const Container = styled.div`
	padding-top: 4px;
`

export const LatestMessage = ({ latestMessage, userId }: Props) => {
	if (!latestMessage) {
		return <></>
	}

	const isMine = userId === latestMessage.to

	return (
		<Container>
			{isMine && "You: "}
			{latestMessage.text}
		</Container>
	)
}
