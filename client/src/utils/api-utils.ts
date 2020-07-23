import { RequestMethod } from "./enums"

export const host = process.env.API_URL || "http://localhost:5000"
export const socketUrl = "ws://localhost:8080/events"

interface RequestInput {
	body?: any
	url: string
	method: RequestMethod
}

export const getSignInInput = (
	email: string,
	password: string,
): RequestInput => ({
	url: `${host}/authentication/sign-in`,
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
	url: `${host}/authentication/sign-up`,
	body: {
		email,
		name,
		password,
	},
	method: RequestMethod.POST,
})

export const getAuthenticateInput = (): RequestInput => ({
	url: `${host}/authentication/`,
	method: RequestMethod.GET,
})

export const getUsersSearchInput = (): RequestInput => ({
	url: `${host}/users?q=`,
	method: RequestMethod.GET,
})

export const getUsersMessagesInput = (): RequestInput => ({
	url: `${host}/messages/`,
	method: RequestMethod.GET,
})

export const getSendMessageInput = (
	text?: string,
	id?: string,
): RequestInput => ({
	url: `${host}/messages/${id || ""}`,
	body: {
		text: text || "",
	},
	method: RequestMethod.POST,
})
