import { RequestMethod } from "./enums"

export const apiUrl =
	process.env.REACT_APP_API_URL || "http://localhost:5000/"
export const socketUrl =
	process.env.REACT_APP_SOCKET_URL || "ws://localhost:8080/events"

export interface RequestInput {
	body?: Record<string, string | number | undefined>
	url: string
	method: RequestMethod
}

export const getSignInInput = (
	email: string,
	password: string,
): RequestInput => ({
	url: `${apiUrl}authentication/sign-in`,
	body: {
		email,
		password,
	},
	method: RequestMethod.POST,
})

export const getSignUpInput = (
	email: string,
	name: string,
	password: string,
): RequestInput => ({
	url: `${apiUrl}authentication/sign-up`,
	body: {
		email,
		name,
		password,
	},
	method: RequestMethod.POST,
})

export const getAuthenticateInput = (): RequestInput => ({
	url: `${apiUrl}authentication/`,
	method: RequestMethod.GET,
})

export const getUsersSearchInput = (): RequestInput => ({
	url: `${apiUrl}users?q=`,
	method: RequestMethod.GET,
})

export const getUsersMessagesInput = (): RequestInput => ({
	url: `${apiUrl}messages/`,
	method: RequestMethod.GET,
})

export const getSendMessageInput = (
	text?: string,
	id?: string,
): RequestInput => ({
	url: `${apiUrl}messages/${id || ""}`,
	body: {
		text: text || "",
	},
	method: RequestMethod.POST,
})

export const getSignOutInput = (): RequestInput => ({
	url: `${apiUrl}authentication/sign-out`,
	method: RequestMethod.POST,
})

export const getLatestMessagesInput = (): RequestInput => ({
	url: `${apiUrl}messages/latest`,
	method: RequestMethod.GET,
})
