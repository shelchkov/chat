import React, { ReactElement, useState } from "react"

import { useWidth } from "../../effects/use-width"
import { UsersList } from "../users/users-list"
import { MessagesList } from "../messages/messages-list"
import { theme } from "../../style-guide/theme"
import { getPixelsFromRem } from "../../utils/utils"
import { User, Message } from "../../utils/interfaces"
import { useLatestMessages } from "../../effects/use-latest-messages"
import {
	addLatestMessagesToUsers,
	markOnlineUsers,
} from "../../utils/user-utils"

interface Props {
	friends: User[] | undefined
	onlineFriends: number[] | undefined
	user: User
	newMessage: Message | undefined
	typingUsers: number[]
	updateUsersList: (users?: User[] | null) => void
	addNewFriend: (userId: number) => void
	handleTyping: (receiverId: number, isStopping?: boolean) => void
}

export const Messages = ({
	friends,
	onlineFriends,
	updateUsersList,
	typingUsers,
	...rest
}: Props): ReactElement => {
	const { isMore: isDesktop } = useWidth(
		getPixelsFromRem(theme.breakpoints[1]),
	)
	const [selectedFriend, setSelectedFriend] = useState<User>()
	const [isSearching, setIsSearching] = useState(false)

	const { latestMessages, updateLatestMessage } = useLatestMessages()

	const showUsersList = (): void => {
		setSelectedFriend(undefined)
	}

	const usersWithLatestMessages = markOnlineUsers(
		addLatestMessagesToUsers(friends, latestMessages),
		onlineFriends,
	)

	if (isDesktop) {
		return (
			<>
				<UsersList
					users={usersWithLatestMessages}
					isSearching={isSearching}
					updateUsersList={updateUsersList}
					handleUserSelect={setSelectedFriend}
					setIsSearching={setIsSearching}
					selectedUserId={selectedFriend && selectedFriend.id}
					typingUsers={typingUsers}
				/>
				<MessagesList
					selectedUser={selectedFriend}
					isSearching={isSearching}
					handleNewMessage={updateLatestMessage}
					{...rest}
				/>
			</>
		)
	}

	if (selectedFriend) {
		return (
			<MessagesList
				selectedUser={selectedFriend}
				isSearching={isSearching}
				handleNewMessage={updateLatestMessage}
				showUsersList={showUsersList}
				isMobile
				{...rest}
			/>
		)
	}

	return (
		<UsersList
			users={usersWithLatestMessages}
			updateUsersList={updateUsersList}
			handleUserSelect={setSelectedFriend}
			isSearching={isSearching}
			setIsSearching={setIsSearching}
			isMobile
			typingUsers={typingUsers}
		/>
	)
}
