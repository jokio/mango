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

  const { authMechanism = 'SCRAM-SHA-1' } = options || {}

  let finalConnectionString = connectionString

  if (!connectionString.includes('authSource')) {
    finalConnectionString +=
      (!connectionString.includes('?') ? '?' : '&') +
      'authSource=admin'
  }

  if (
    !finalConnectionString.includes('authMechanism') &&
    authMechanism
  ) {
    finalConnectionString +=
      (!finalConnectionString.includes('?') ? '?' : '&') +
      `authMechanism=${authMechanism}`
  }

  const client = new MongoClient()
  const db = await client.connect(finalConnectionString)

  return { client, db }
}
