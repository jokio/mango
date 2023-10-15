import { Database, MongoClient } from '../deps.ts'
import { connectMongo } from '../src/connectMongo.ts'

const hostname = '127.0.0.1'

export async function withDb(
  fn: (db: Database, client: MongoClient) => void | Promise<void>,
) {
  const { client } = await connectMongo(
    `mongodb://${hostname}:27017/test`,
  )

  await fn(client.db(), client)

  client.close()
}
