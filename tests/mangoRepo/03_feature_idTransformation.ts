import { Database } from '../../deps.ts'
import { MangoRepo } from '../../mod.ts'
import { withDb } from '../common.ts'
import { assertEquals, assertExists } from '../test.deps.ts'

Deno.test(
  'should do the _id transformation to ObjectId on create',
  () =>
    withDb(async db => {
      const repo = getRepo(db)

      const name = 'ezeki'

      const item = await repo.insert({ name })
      assertExists(item)
      assertExists(item._id)
      assertEquals(typeof item._id, 'string')
    }),
)

Deno.test(
  'should do the _id transformation to ObjectId and back to string on update',
  () =>
    withDb(async db => {
      const repo = getRepo(db)

      const name = 'babt'

      const item = await repo.insert({ name })
      assertExists(item)

      const updatedItem = await repo.updateOne(
        { _id: item._id },
        { $set: { age: 100 } },
      )
      assertExists(updatedItem)
      assertExists(updatedItem?._id)
      assertEquals(typeof updatedItem?._id, 'string')
    }),
)

Deno.test(
  'should do the _id transformation to ObjectId and back to string on getById',
  () =>
    withDb(async db => {
      const repo = getRepo(db)

      const name = 'babt'

      const item = await repo.insert({ name })
      assertExists(item)

      const updatedItem = await repo.getById(item._id)
      assertExists(updatedItem)
      assertExists(updatedItem?._id)
      assertEquals(typeof updatedItem?._id, 'string')
    }),
)

Deno.test(
  'should do the _id transformation to ObjectId and back to string on query',
  () =>
    withDb(async db => {
      const repo = getRepo(db)

      const name = 'babt'

      const item = await repo.insert({ name })
      assertExists(item)

      const updatedItems = await repo.find({ _id: item._id })
      assertExists(updatedItems)
      assertEquals(updatedItems.length, 1)
      assertEquals(typeof updatedItems[0]._id, 'string')
    }),
)

Deno.test(
  'should do the _id transformation to ObjectId and back to string on count',
  () =>
    withDb(async db => {
      const repo = getRepo(db)

      const name = 'babt'

      const item = await repo.insert({ name })
      assertExists(item)

      const count = await repo.count({ _id: item._id })
      assertEquals(count, 1)
    }),
)

function getRepo(db: Database) {
  return new MangoRepo<User>(db, 'test', {
    idMapping: false,
    idTransformation: true,
  })
}

export type User = {
  _id: string
  name: string
  zodiac?: string
  age?: number
}
