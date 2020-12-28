export interface User {
	email: string
	name: string
	id: number
	friends?: User[]
	isOnline?: boolean
	notFriend?: boolean
}

export interface Message {
	id: number
	text: string
	from: number
	to: number
}
