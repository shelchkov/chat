import React, { ReactElement, useState } from "react"
import { useWidth } from "../../effects/use-width"

import { UsersList } from "../users/users-list"
import { MessagesList } from "../messages/messages-list"

import { theme } from "../../style-guide/theme"
import { getPixelsFromRem } from "../../utils/utils"
import { User, Message } from "../../utils/interfaces"

interface Props {
	friends: User[] | undefined
	onlineFriends: number[] | undefined
	user: User
	newMessage: Message | undefined
	updateUsersList: (users?: User[] | null) => void
	addNewFriend: (userId: number) => void
}

export const Messages = ({
	friends,
	onlineFriends,
	user,
	newMessage,
	updateUsersList,
	addNewFriend,
}: Props): ReactElement => {
	const { isMore: isDesktop } = useWidth(
		getPixelsFromRem(theme.breakpoints[1]),
	)
	const [selectedFriend, setSelectedFriend] = useState<User>()
	const [isSearching, setIsSearching] = useState(false)

	const showUsersList = (): void => {
		setSelectedFriend(undefined)
	}

	if (isDesktop) {
		return (
			<>
				<UsersList
					users={friends}
					updateUsersList={updateUsersList}
					handleUserSelect={setSelectedFriend}
					isSearching={isSearching}
					setIsSearching={setIsSearching}
					onlineFriends={onlineFriends}
					selectedUserId={selectedFriend && selectedFriend.id}
				/>
				<MessagesList
					selectedUser={selectedFriend}
					isSearching={isSearching}
					user={user}
					newMessage={newMessage}
					addNewFriend={addNewFriend}
				/>
			</>
		)
	}

	if (selectedFriend) {
		return (
			<MessagesList
				selectedUser={selectedFriend}
				isSearching={isSearching}
				user={user}
				newMessage={newMessage}
				addNewFriend={addNewFriend}
				isMobile
				showUsersList={showUsersList}
			/>
		)
	}

	return (
		<UsersList
			users={friends}
			updateUsersList={updateUsersList}
			handleUserSelect={setSelectedFriend}
			isSearching={isSearching}
			setIsSearching={setIsSearching}
			onlineFriends={onlineFriends}
			isMobile
		/>
	)
}
