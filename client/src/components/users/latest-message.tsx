import React, { ReactElement } from "react"

import { Message } from "../../utils/interfaces"

interface Props {
	latestMessage: Message | undefined
	userId: number
}

export const LatestMessage = ({
	latestMessage,
	userId,
}: Props): ReactElement => {
	if (!latestMessage) {
		return <></>
	}

	const isMine = userId === latestMessage.to

	return (
		<div>
			{isMine && "You: "}
			{latestMessage.text}
		</div>
	)
}
