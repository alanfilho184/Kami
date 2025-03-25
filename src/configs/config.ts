import dotenv from 'dotenv'
import { Discord_Id, Channel_Id } from '../types/validations'
import process from "node:process";

if (process.env.NODE_ENV === 'production') {
	dotenv.config({ path: 'prod.env' })
}
else if (process.env.NODE_ENV === 'test') {
	dotenv.config({ path: 'test.env' })
}
else {
	dotenv.config({ path: '.env' })
}

const config: EnvVars = {
	NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
	DATABASE_URL: process.env.DATABASE_URL as string,
	PORT: Number(process.env.PORT),
	BOT_TOKEN: process.env.BOT_TOKEN as string,
	PUBLIC_KEY: process.env.PUBLIC_KEY as string,
	CLIENT_ID: new Discord_Id(process.env.CLIENT_ID as string),
	CLIENT_SECRET: process.env.CLIENT_SECRET as string,
	OWNER_ID: new Discord_Id(process.env.OWNER_ID as string),
	LOG_CHANNEL_ID: new Channel_Id(process.env.LOG_CHANNEL_ID as string),
	COMMAND_WEBHOOK_ID: new Discord_Id(process.env.COMMAND_WEBHOOK_ID as string),
	COMMAND_WEBHOOK_TOKEN: process.env.COMMAND_WEBHOOK_TOKEN as string,
	LOG_WEBHOOK_ID: new Discord_Id(process.env.LOG_WEBHOOK_ID as string),
	LOG_WEBHOOK_TOKEN: process.env.LOG_WEBHOOK_TOKEN as string,
	EMBED_COLOR: process.env.EMBED_COLOR as string,
	VERSION: process.env.npm_package_version as string,
}

export default config