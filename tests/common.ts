import { Database, MongoClient } from '../deps.ts'
import { connectMongo } from '../src/connectMongo.ts'

const hostname = '127.0.0.1'

export async function withDb(
  fn: (db: Database, client: MongoClient) => void | Promise<void>,
) {
  const { client } = await connectMongo(
    `mongodb+srv://dev:v5ww8kQs75CDdYuu@jok-dev.z5ywe.mongodb.net/?retryWrites=true&w=majority`,
  )

  await fn(client.db(), client)

  client.close()
}
