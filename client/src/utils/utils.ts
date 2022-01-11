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

export const throttle = (
	fn: () => void,
	delay: number,
): (() => void) => {
	let isDisabled: boolean

	return () => {
		if (isDisabled) {
			return
		}

		isDisabled = true

		setTimeout(() => {
			isDisabled = false
		}, delay)

		fn()
	}
}

export const debounce = (
	fn: () => void,
	delay: number,
): (() => void) => {
	let timer: number

	return () => {
		timer && clearTimeout(timer)
		timer = setTimeout(fn, delay)
	}
}
