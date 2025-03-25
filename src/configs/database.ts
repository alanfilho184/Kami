import config from './config'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient({
	datasources: {
		db: {
			url: config.DATABASE_URL,
		}
	}
})

async function verifyConnection() {
	return await db.$connect()
}

export default db
export { verifyConnection }