import { RequestMethod } from "./enums"

interface RequestInput {
	body?: any
	url: string
	method: RequestMethod
}

export const getSignInInput = (email: string, password: string): RequestInput => ({
	url: "http://localhost:5000/authentication/sign-in",
	body: {
		email,
		password
	},
	method: RequestMethod.POST
})

export const getSignUpInput = (email: string, name: string, password: string): RequestInput => ({
	url: "http://localhost:5000/authentication/sign-up",
	body: {
		email,
		name,
		password
	},
	method: RequestMethod.POST
})
