import { useState } from "react"

type Result<T> = [
	T[] | undefined,
	(value: T[] | undefined) => void,
	(value: T) => void,
	() => void,
]

export const useArrayState = <T>(initialValue?: T[]): Result<T> => {
	const [value, setValue] = useState<T[] | undefined>(initialValue)

	const addValue = (newValue: T) =>
		setValue([...(value || []), newValue])
	const reset = () => setValue(undefined)

	return [value, setValue, addValue, reset]
}
