import { ValidationRules } from "react-hook-form/dist/types/validator"

export const validationRules: ValidationRules = {
	required: true,
	validate: (value): boolean => !!value.trim(),
}

export const passwordValidationRules = {
	...validationRules,
	minLength: 6,
}
