import { MongoClient } from '../deps.ts'
import { buildConnectionString } from './domain/buildConnectionString.ts'

interface Options {
  /**
   * @default SCRAM-SHA-1
   */
  authMechanism?: string
}

export async function connectMongo(
  connectionString: string,
  options?: Options,
) {
  if (!connectionString) {
    throw new Error('Invalid connection string')
  }

  const { authMechanism = 'SCRAM-SHA-1' } = options || {}

  const finalConnectionString = buildConnectionString(
    connectionString,
    authMechanism,
  )

  const client = new MongoClient()
  const db = await client.connect(finalConnectionString)

  return { client, db }
}
