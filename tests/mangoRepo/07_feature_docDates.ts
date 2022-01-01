import { Database } from '../../deps.ts'
import { MangoRepo } from '../../mod.ts'
import { MangoDocumentDates } from '../../src/types.ts'
import { withDb } from '../common.ts'
import { assertEquals, assertExists } from '../test.deps.ts'

Deno.test('should set createdAt on create', () =>
  withDb(async db => {
    const repo = getRepo(db)

    const item = await repo.insert({ name: 'versionItem' })

    assertExists(item)
    assertExists(item.createdAt)
    assertEquals(typeof item.updatedAt, 'undefined')
  }),
)

Deno.test(
  'should not change createdAt and set updatedAt on updateOne & updateMany',
  () =>
    withDb(async db => {
      const repo = getRepo(db)

      const item = await repo.insert({ name: 'versionItem' })
      assertExists(item)
      assertExists(item.createdAt)
      assertEquals(typeof item.updatedAt, 'undefined')

      const updatedItem = await repo.updateOne(
        { id: item.id },
        { $set: { name: 'VersionedTest', tag: 'test' } },
      )
      assertExists(updatedItem)
      assertEquals(
        updatedItem.createdAt.getTime(),
        item.createdAt.getTime(),
      )
      assertExists(updatedItem.updatedAt)

      const count = await repo.updateMany(
        { tag: 'test' },
        { $set: { tag: 'Test' } },
      )
      assertEquals(count, 1)

      const finalItem = await repo.getById(item.id)

      assertExists(finalItem)
      assertEquals(
        finalItem.createdAt.getTime(),
        item.createdAt.getTime(),
      )
      assertExists(finalItem.updatedAt)
    }),
)

function getRepo(db: Database) {
  return new MangoRepo<User>(db, 'test', {
    docDates: true,
  })
}

export type User = MangoDocumentDates & {
  id: string
  name: string
  tag?: string
  zodiac?: string
  age?: number
}
