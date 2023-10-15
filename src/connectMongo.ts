import { MongoClient } from '../deps.ts'

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

  // const { authMechanism = 'SCRAM-SHA-1' } = options || {}

  // const finalConnectionString = buildConnectionString(
  //   connectionString,
  //   authMechanism,
  // )

  const client = new MongoClient(connectionString)
  await client.connect()

  const db = client.db()

  return { client, db }
}
