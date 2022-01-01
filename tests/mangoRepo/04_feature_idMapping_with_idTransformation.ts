import { Database } from '../../deps.ts'
import { MangoRepo } from '../../mod.ts'
import { withDb } from '../common.ts'
import { assertEquals, assertExists } from '../test.deps.ts'

Deno.test(
  'should do the id transformation to ObjectId on create',
  () =>
    withDb(async db => {
      const repo = getRepo(db)
      const name = 'ezeki'

      const item = await repo.insert({ name })
      assertExists(item)
      assertExists(item.id)
      assertEquals(typeof item.id, 'string')
    }),
)

Deno.test(
  'should do the id transformation to ObjectId and back to string on update',
  () =>
    withDb(async db => {
      const repo = getRepo(db)
      const name = 'babt'

      const item = await repo.insert({ name })
      assertExists(item)

      const updatedItem = await repo.updateOne(
        { id: item.id },
        { $set: { age: 100 } },
      )
      assertExists(updatedItem)
      assertExists(updatedItem.id)
      assertEquals(typeof updatedItem.id, 'string')
    }),
)

Deno.test(
  'should do the id transformation to ObjectId and back to string on getById',
  () =>
    withDb(async db => {
      const repo = getRepo(db)
      const name = 'babt'

      const item = await repo.insert({ name })
      assertExists(item)

      const updatedItem = await repo.getById(item.id)
      assertExists(updatedItem)
      assertExists(updatedItem.id)
      assertEquals(typeof updatedItem.id, 'string')
    }),
)

Deno.test(
  'should do the id transformation to ObjectId and back to string on query',
  () =>
    withDb(async db => {
      const repo = getRepo(db)
      const name = 'babt'

      const item = await repo.insert({ name })
      assertExists(item)

      const updatedItems = await repo.find({ id: item.id })
      assertExists(updatedItems)
      assertEquals(updatedItems.length, 1)
      assertEquals(typeof updatedItems[0].id, 'string')
    }),
)

Deno.test(
  'should do the id transformation to ObjectId and back to string on count',
  () =>
    withDb(async db => {
      const repo = getRepo(db)
      const name = 'babt'

      const item = await repo.insert({ name })
      assertExists(item)

      const count = await repo.count({ id: item.id })
      assertEquals(count, 1)
    }),
)

function getRepo(db: Database) {
  return new MangoRepo<User>(db, 'test', {
    idMapping: true,
    idTransformation: true,
  })
}

export type User = {
  id: string
  name: string
  zodiac?: string
  age?: number
}
