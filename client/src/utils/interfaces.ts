export interface User {
	email: string
	name: string
	id: number
}

export interface Friend {
	id: number
	userId: number
	friendId: number
}

export interface Message {
	id: number
	text: string
	from: number
	to: number
}
