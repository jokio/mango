import { Database } from '../../deps.ts'
import { MangoRepo, ObjectId } from '../../mod.ts'
import { withDb } from '../common.ts'
import { assertEquals, assertExists } from '../test.deps.ts'

type User = {
  id: string
  nickname: string
  uniqueId?: string
  zodiac?: string
  age?: number
}

Deno.test('should create new entry', () =>
  withDb(async db => {
    const repo = getRepo(db)

    const nickname = 'ezeki'

    const result = await repo.insert({ nickname })

    assertExists(result)
    assertExists(result.id)
    assertEquals(result.nickname, nickname)
  }),
)

Deno.test('should create many entries', () =>
  withDb(async db => {
    const repo = getRepo(db)

    const ids = await repo.insertMany([
      { nickname: 'u1' },
      { nickname: 'u2' },
    ])

    assertExists(ids)
    assertEquals(ids.length, 2)
  }),
)

Deno.test('should update entry', () =>
  withDb(async db => {
    const repo = getRepo(db)

    const item = await repo.insert({ nickname: 'EZ' })

    const updatedItem = await repo.updateOne(
      { id: item.id },
      { $set: { zodiac: 'leo' } },
    )

    assertExists(updatedItem)
    assertEquals(updatedItem.nickname, 'EZ')
    assertEquals(updatedItem.zodiac, 'leo')

    const finalItem = await repo.updateOne(
      { id: item.id },
      { $inc: { age: 1 } },
    )

    assertExists(finalItem)
    assertEquals(finalItem.nickname, 'EZ')
    assertEquals(finalItem.zodiac, 'leo')
    assertEquals(finalItem.age, 1)
  }),
)

Deno.test('should update many entries', () =>
  withDb(async db => {
    const repo = getRepo(db)

    const uniqueId = Date.now().toString()

    const insertedIds = await repo.insertMany([
      { nickname: 'U1', age: 20, uniqueId },
      { nickname: 'U2', age: 20, uniqueId },
    ])

    const { matchedCount } = await repo.updateMany(
      { age: 20, uniqueId },
      { $inc: { age: 1 } },
    )

    assertExists(insertedIds)

    assertEquals(insertedIds.length, matchedCount)
    assertEquals(matchedCount, 2)
  }),
)

Deno.test('should delete many entries', () =>
  withDb(async db => {
    const repo = getRepo(db)

    const uniqueId = Date.now().toString()

    const insertedIds = await repo.insertMany([
      { nickname: 'U1', age: 18, uniqueId },
      { nickname: 'U2', age: 18, uniqueId },
    ])

    const deletedCount = await repo.deleteMany({ age: 18, uniqueId })

    assertEquals(insertedIds.length, deletedCount)
    assertEquals(deletedCount, 2)
  }),
)

Deno.test('should query documents count', () =>
  withDb(async db => {
    const repo = getRepo(db)

    const uniqueId = Date.now().toString()

    const insertedIds = await repo.insertMany([
      { nickname: 'U1', age: 17, uniqueId },
      { nickname: 'U2', age: 17, uniqueId },
      { nickname: 'U3', age: 17, uniqueId },
      { nickname: 'U3', age: 19, uniqueId },
    ])

    const count17 = await repo.count({ age: 17, uniqueId })
    const count19 = await repo.count({ age: 19, uniqueId })
    const count20 = await repo.count({ age: 20, uniqueId })

    assertEquals(insertedIds.length, 4)
    assertEquals(count17, 3)
    assertEquals(count19, 1)
    assertEquals(count20, 0)
  }),
)

Deno.test('should query document by id', () =>
  withDb(async db => {
    const repo = getRepo(db)

    const item = await repo.insert({
      nickname: 'RandomUserName',
      age: 5,
    })

    const queriedItem = await repo.getById(item.id)

    assertExists(queriedItem)
    assertEquals(queriedItem.id, item.id)
    assertEquals(queriedItem.nickname, item.nickname)
  }),
)

Deno.test('should query documents by filter', () =>
  withDb(async db => {
    const repo = getRepo(db)

    const uniqueId = Date.now().toString()

    const insertedIds = await repo.insertMany([
      { nickname: 'U1', age: 31, uniqueId },
      { nickname: 'U2', age: 31, uniqueId },
      { nickname: 'U3', age: 31, uniqueId },
      { nickname: 'U3', age: 30, uniqueId },
    ])

    const age31 = await repo.find({ age: 31, uniqueId })
    const age30 = await repo.find({ age: 30, uniqueId })
    const age20 = await repo.find({ age: 20, uniqueId })

    assertEquals(insertedIds.length, 4)
    assertEquals(age31.length, 3)
    assertEquals(age30.length, 1)
    assertEquals(age20.length, 0)
  }),
)

Deno.test('should query documents by _id filter (complex)', () =>
  withDb(async db => {
    const repo = getRepo(db)

    const id1 = new ObjectId().toHexString()
    const id2 = new ObjectId().toHexString()

    const uniqueId = Date.now().toString()

    const insertedIds = await repo.insertMany([
      { id: id1, nickname: 'U1', age: 31, uniqueId },
      { id: id2, nickname: 'U2', age: 31, uniqueId },
      { nickname: 'U3', age: 31, uniqueId },
      { nickname: 'U3', age: 30, uniqueId },
    ])

    const count1 = await repo.count({ id: { $in: [id1] }, uniqueId })
    const count2 = await repo.count({
      id: { $in: [id1, id2] },
      uniqueId,
    })

    assertEquals(insertedIds.length, 4)
    assertEquals(count1, 1)
    assertEquals(count2, 2)
  }),
)

function getRepo(db: Database) {
  return new MangoRepo<User>(db, 'test')
}
