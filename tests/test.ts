import { MongoClient } from '../deps.ts'
import { assert } from './test.deps.ts'
import { MangoRepo } from '../src/mangoRepo.ts'

Deno.test('it should create MangoRepo class', async () => {
  const client = new MongoClient()
  const db = await client.connect('mongodb://localhost:27017')

  const repo = new MangoRepo<{ id: string; name: string }>(db, 'test')

  const result = await repo.insertOne({
    name: 'Ezeki',
  })

  const tt = await repo.updateOne(
    { id: result.id },
    {
      $addToSet: {
        items: {
          $each: [1, 2, 3],
        },
      },
    },
  )

  console.log(result)
  console.log(tt)

  assert(repo, 'should be defined')

  client.close()
})
