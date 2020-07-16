import { RequestMethod } from "./enums"

const host = "http://localhost:5000"

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

export const getFriendsInput = (): RequestInput => ({
	url: `${host}/friends/`,
	method: RequestMethod.GET,
})

export const getUsersMessagesInput = (): RequestInput => ({
	url: `${host}/messages/`,
	method: RequestMethod.GET,
})
