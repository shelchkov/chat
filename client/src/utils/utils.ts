import { ValidationRules } from "react-hook-form"

import { User } from "./interfaces"

export const getSignedOutInputWidth = (
	breakpoint: number,
	isSendMessageform?: boolean,
): string => {
	if (isSendMessageform) {
		return "fill-available"
	}

	return breakpoint === 0 ? "16rem" : "18rem"
}

export const requiredFieldError = "Required field"
export const minLengthFieldError = "At least 6 characters"
export const validateFieldError = "Shouldn't end or start w/ space"

export const somethingWentWrong =
	"Something went wrong. Please Try again"
export const loadingText = "Loading..."

const remSize = 16

export const getPixelsFromRem = (rem: string): number =>
	parseInt(rem) * remSize

export const noop = (): undefined => undefined

export const markNotFriends = (
	users: User[],
	friends: User[],
): User[] =>
	users.map((user) =>
		friends.find((friend) => friend.id === user.id)
			? user
			: { ...user, notFriend: true },
	)

export const splitUsers = (users: User[]) =>
	users.reduce(
		(acc, user) => {
			if (user.notFriend) {
				acc.notFriends.push(user)
			} else {
				acc.friends.push(user)
			}

			return acc
		},
		{ friends: [], notFriends: [] } as {
			friends: User[]
			notFriends: User[]
		},
	)

export const validationRules: ValidationRules = {
	required: true,
	validate: (value): boolean => !!value.trim(),
}

export const passwordValidationRules = {
	...validationRules,
	minLength: 6,
}
