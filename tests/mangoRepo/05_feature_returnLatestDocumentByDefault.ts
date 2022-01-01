import { Database } from '../../deps.ts'
import { MangoRepo } from '../../mod.ts'
import { withDb } from '../common.ts'
import { assertEquals, assertExists } from '../test.deps.ts'

Deno.test('should return the original document after update', () =>
  withDb(async db => {
    const repo = getRepo(db, false)

    await repo.insert({ name: 'test1', age: 10 })

    const result = await repo.updateOne(
      { name: 'test1' },
      { $set: { name: 'test2' } },
    )
    assertExists(result)
    assertEquals(result.name, 'test1')
  }),
)

Deno.test('should return the updated document after update', () =>
  withDb(async db => {
    const repo = getRepo(db, true)

    await repo.insert({ name: 'test1', age: 10 })

    const result = await repo.updateOne(
      { name: 'test1' },
      { $set: { name: 'test2' } },
    )
    assertExists(result)
    assertEquals(result.name, 'test2')
  }),
)

function getRepo(
  db: Database,
  returnLatestDocumentByDefault: boolean,
) {
  return new MangoRepo<User>(db, 'test', {
    returnLatestDocumentByDefault,
  })
}

export type User = {
  _id: string
  name: string
  zodiac?: string
  age?: number
}
