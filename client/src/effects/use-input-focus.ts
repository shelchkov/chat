import { RefObject, useEffect } from "react"

export const useInputFocus = (
	reference?: RefObject<HTMLElement>,
): void => {
	useEffect(() => {
		reference?.current?.focus()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
}
