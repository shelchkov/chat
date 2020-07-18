export const getSignedOutInputWidth = (
	breakpoint: number,
	isSendMessageform?: boolean,
): string => {
	if (isSendMessageform) {
		return "fill-available"
	}

	return breakpoint === 0 ? "16rem" : "18rem"
}

export const apiUrl = "http://localhost:5000"

export const requiredFieldText = "Required filed"
export const somethingWentWrong =
	"Something went wrong. Please Try again"
export const loadingText = "Loading..."
