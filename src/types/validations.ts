import { ValidationError } from './errors'

function default_id_validation(id: string, type: string) {
	if (!id) {
		throw new ValidationError(`"${id}" is not a valid ${type}`, 'Not a valid string')
	} else if (!id.match(/^\d+$/g)) {
		throw new ValidationError(`"${id}" is not a valid ${type}`, `The ${type} must contain only digits`)
	} else if (id.length < 18 || id.length > 20) {
		throw new ValidationError(`"${id}" is not a valid ${type}`, `The ${type} must have between 18 and 20 digits of length`)
	} else {
		return id
	}
}

class Discord_Id {
	discord_id: string
	constructor(discord_id: string) {
		this.discord_id = default_id_validation(discord_id, 'discord_id')
	}

	static isValid(discord_id: string) {
		try {
			new Discord_Id(discord_id)
			return true
		} catch (err) {
			return false
		}
	}
}

class Server_Id {
	server_id: string
	constructor(server_id: string) {
		this.server_id = default_id_validation(server_id, 'server_id')
	}

	static isValid(server_id: string) {
		try {
			new Server_Id(server_id)
			return true
		} catch (err) {
			return false
		}
	}
}

class Msg_Id {
	msg_id: string
	constructor(msg_id: string) {
		this.msg_id = default_id_validation(msg_id, 'msg_id')
	}

	static isValid(msg_id: string) {
		try {
			new Msg_Id(msg_id)
			return true
		} catch (err) {
			return false
		}
	}
}

class Channel_Id {
	channel_id: string
	constructor(channel_id: string) {
		this.channel_id = default_id_validation(channel_id, 'channel_id')
	}

	static isValid(channel_id: string) {
		try {
			new Channel_Id(channel_id)
			return true
		} catch (err) {
			return false
		}
	}
}

class Sheet_Name {
	sheet_name: string
	constructor(sheet_name: string) {
		if (sheet_name.length > 32) {
			throw new ValidationError(`"${sheet_name}" is not a valid sheet_name`, 'Exceeded the maximum of 32 characters')
		} else if (sheet_name.match(/['$%]/g)) {
			throw new ValidationError(`"${sheet_name}" is not a valid sheet_name`, 'Contains invalid characters')
		} else {
			this.sheet_name = sheet_name
		}
	}

	static isValid(sheet_name: string) {
		try {
			new Sheet_Name(sheet_name)
			return true
		} catch (err) {
			return false
		}
	}
}

class Macro_Name {
	macro_name: string
	constructor(macro_name: string) {
		if (macro_name.length > 32) {
			throw new ValidationError(`"${macro_name}" is not a valid macro_name`, 'Exceeded the maximum of 32 characters')
		} else if (macro_name.match(/['$%]/g)) {
			throw new ValidationError(`"${macro_name}" is not a valid macro_name`, 'Contains invalid characters')
		} else {
			this.macro_name = macro_name
		}
	}

	static isValid(macro_name: string) {
		try {
			new Macro_Name(macro_name)
			return true
		} catch (err) {
			return false
		}
	}
}

export { Discord_Id, Server_Id, Msg_Id, Channel_Id, Sheet_Name, Macro_Name }
