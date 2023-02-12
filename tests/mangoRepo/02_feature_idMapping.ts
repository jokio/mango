import { Database } from '../../deps.ts'
import { MangoRepo, ObjectId } from '../../mod.ts'
import { withDb } from '../common.ts'
import {
  assertEquals,
  assertExists,
  assertFalse,
} from '../test.deps.ts'

Deno.test('should do the id mapping to _id and back on create', () =>
  withDb(async db => {
    const repo = getRepo(db)

    const name = 'ezeki'

    const item = await repo.insert({ name })
    assertExists(item)
    assertExists(item.id)
    assertEquals(typeof item.id, 'object')
    assertEquals(typeof item.id.toHexString(), 'string')
  }),
)

Deno.test('should do the id mapping to _id and back on update', () =>
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
    assertExists(updatedItem?.id)
    assertEquals(typeof updatedItem?.id, 'object')
  }),
)

Deno.test('should do the id mapping to _id and back on getById', () =>
  withDb(async db => {
    const repo = getRepo(db)
    const name = 'babt'

    const item = await repo.insert({ name })
    assertExists(item)

    const updatedItem = await repo.getById(item.id)
    assertExists(updatedItem)
    assertExists(updatedItem.id)
    assertEquals(typeof updatedItem.id, 'object')
  }),
)

Deno.test('should do the id mapping to _id and back on query', () =>
  withDb(async db => {
    const repo = getRepo(db)
    const name = 'babt'

    const item = await repo.insert({ name })
    assertExists(item)

    const updatedItems = await repo.find({ id: item.id })
    assertExists(updatedItems)
    assertEquals(updatedItems.length, 1)
    assertEquals(typeof updatedItems[0]?.id, 'object')
  }),
)

Deno.test('should do the id mapping to _id and back on count', () =>
  withDb(async db => {
    const repo = getRepo(db)
    const name = 'babt'

    const item = await repo.insert({ name })
    assertExists(item)

    const count = await repo.count({ id: item.id })
    assertEquals(count, 1)
  }),
)

Deno.test(
  'ensure that old id mapped field is not there after mapping, on create',
  () =>
    withDb(async db => {
      const repo = getRepo(db)
      const name = 'babt'

      const item = await repo.insert({ name })
      assertExists(item)

      const dbItem = await repo.collection.findOne({
        _id: new ObjectId(item.id),
      })

      assertExists(dbItem)
      assertExists((dbItem as any)['_id'])
      assertFalse(dbItem.id)
    }),
)

Deno.test(
  'ensure that old id mapped field is not there after mapping, on update',
  () =>
    withDb(async db => {
      const repo = getRepo(db)
      const name = 'Ezeki'

      const item = await repo.insert({ name })
      assertExists(item)

      const dbItem = await repo.collection.findOne({
        _id: new ObjectId(item.id),
      })

      await repo.collection.updateOne(
        { _id: new ObjectId(item.id) },
        {
          $set: { name: 'Ezekia' },
        },
      )

      const dbItem2 = await repo.collection.findOne({
        _id: new ObjectId(item.id),
      })

      assertExists(dbItem2)
      assertExists((dbItem2 as any)['_id'])
      assertEquals(
        (dbItem2 as any)['_id'].toHexString(),
        item.id.toHexString(),
      )
      assertEquals(dbItem2.name, 'Ezekia')
      assertFalse(dbItem2.id)
    }),
)

function getRepo(db: Database) {
  return new MangoRepo<User>(db, 'test', {
    idMapping: true,
    idTransformation: false,
  })
}

export type User = {
  id: ObjectId
  name: string
  zodiac?: string
  age?: number
}
