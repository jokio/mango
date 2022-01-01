import { assert } from './test.deps.ts'
import { MangoRepo } from '../src/mangoRepo.ts'
import { connectMongo } from '../src/connectMongo.ts'

Deno.test('it should create MangoRepo class', async () => {
  const { client, db } = await connectMongo(
    'mongodb://localhost:27017/test',
  )
  const repo = new MangoRepo<{ id: string; name: string }>(db, 'test')

  const result = await repo.insertOne({
    name: 'Ezeki',
  })

  await repo.updateOne(
    { id: result.id },
    {
      $addToSet: {
        items: {
          $each: [1, 2, 3],
        },
      },
    },
  )

  assert(repo, 'should be defined')

  client.close()
})
