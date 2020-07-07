interface Theme {
	breakpoints: string[]
	colors: { [key: string]: string[] }
}

export const theme: Theme = {
	breakpoints: ["30rem"],
	colors: {
		greys: ["#333", "#ccc"],
	},
}
