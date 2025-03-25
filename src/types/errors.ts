class ValidationError extends Error {
	code: string
	constructor(message: string, code: string) {
		super(message)
		this.name = 'ValidationError'
		this.code = code
	}
}

export { ValidationError }
