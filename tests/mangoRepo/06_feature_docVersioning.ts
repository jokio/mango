import { Database } from '../../deps.ts'
import { MangoRepo } from '../../mod.ts'
import { MangoDocumentVersion } from '../../src/types.ts'
import { withDb } from '../common.ts'
import { assertEquals, assertExists } from '../test.deps.ts'

Deno.test('should set version on create', () =>
  withDb(async db => {
    const repo = getRepo(db)

    const item = await repo.insert({ name: 'versionItem' })
    assertExists(item)
    assertEquals(item.version, 1)
  }),
)

Deno.test('should inc version on updateOne & updateMany', () =>
  withDb(async db => {
    const repo = getRepo(db)

    const item = await repo.insert({ name: 'versionSecondItem' })
    assertExists(item)
    assertEquals(item.version, 1)

    const updatedItem = await repo.updateOne(
      { id: item.id },
      { $set: { name: 'VersionedTest', tag: 'test' } },
    )
    assertExists(updatedItem)
    assertEquals(updatedItem.version, 2)

    const { modifiedCount: count } = await repo.updateMany(
      { tag: 'test' },
      { $set: { tag: 'Test' } },
    )
    assertEquals(count, 1)

    const finalItem = await repo.getById(item.id)

    assertExists(finalItem)
    assertEquals(finalItem.version, 3)
  }),
)

function getRepo(db: Database) {
  return new MangoRepo<User>(db, 'test', {
    docVersioning: true,
  })
}

export type User = MangoDocumentVersion & {
  id: string
  name: string
  tag?: string
  zodiac?: string
  age?: number
}
