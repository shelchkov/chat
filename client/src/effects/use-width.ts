import { useState, useEffect } from "react"

interface WidthProps {
	width: number
	isMore?: boolean
}

export const useWidth = (breakpoint?: number): WidthProps => {
	const [width, setWidth] = useState<number>(window.innerWidth)
	const [isMore, setIsMore] = useState<boolean | undefined>(
		breakpoint ? window.innerWidth - breakpoint >= 0 : undefined,
	)

	useEffect((): void => {
		window.onresize = (): void => {
			setWidth(window.innerWidth)

			if (breakpoint) {
				setIsMore(window.innerWidth - breakpoint >= 0)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [setWidth])

	return { width, isMore }
}
