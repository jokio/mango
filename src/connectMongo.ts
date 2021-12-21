import { MongoClient } from '../deps.ts'

export async function connectMongo(connectionString: string) {
  if (!connectionString) {
    throw new Error('Invalid connection string')
  }

  let finalConnectionString = connectionString

  if (!connectionString.includes('authSource')) {
    finalConnectionString +=
      (!connectionString.includes('?') ? '?' : '&') +
      'authSource=admin'
  }

  const client = new MongoClient()
  const db = await client.connect(finalConnectionString)

  return { client, db }
}
