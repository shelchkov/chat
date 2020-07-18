export interface User {
	email: string
	name: string
	id: number
	friends?: User[]
}

export interface Message {
	id: number
	text: string
	from: number
	to: number
}
