import { MangoRepo, ObjectId } from '../../mod.ts'
import { withDb } from '../common.ts'
import { assertEquals } from '../test.deps.ts'

const collectionName = 'test'

Deno.test('should log create call', () =>
  withDb(
    db =>
      new Promise(resolve => {
        const repo = new MangoRepo<User>(db, collectionName, {
          logger: ({ collectionName: name, action }) => {
            assertEquals(name, collectionName)
            assertEquals(action, 'insert')

            resolve()
          },
        })

        repo.insert({ name: 'test1', age: 10 })
      }),
  ),
)

Deno.test('should log createMany call', () =>
  withDb(
    db =>
      new Promise(resolve => {
        const repo = new MangoRepo<User>(db, collectionName, {
          logger: ({ collectionName: name, action }) => {
            assertEquals(name, collectionName)
            assertEquals(action, 'insertMany')

            resolve()
          },
        })

        repo.insertMany([{ name: 'test1', age: 10 }])
      }),
  ),
)

Deno.test('should log updateOne call', () =>
  withDb(
    db =>
      new Promise(resolve => {
        const repo = new MangoRepo<User>(db, collectionName, {
          logger: ({ collectionName: name, action }) => {
            assertEquals(name, collectionName)
            assertEquals(action, 'updateOne')

            resolve()
          },
        })

        repo.updateOne(
          { name: 'test1', age: 10 },
          { $set: { name: 'test2' } },
        )
      }),
  ),
)

Deno.test('should log updateMany call', () =>
  withDb(
    db =>
      new Promise(resolve => {
        const repo = new MangoRepo<User>(db, collectionName, {
          logger: ({ collectionName: name, action }) => {
            assertEquals(name, collectionName)
            assertEquals(action, 'updateMany')

            resolve()
          },
        })

        repo.updateMany(
          { name: 'test1', age: 10 },
          { $set: { name: 'test3' } },
        )
      }),
  ),
)

Deno.test('should log count call', () =>
  withDb(
    db =>
      new Promise(resolve => {
        const repo = new MangoRepo<User>(db, collectionName, {
          logger: ({ collectionName: name, action }) => {
            assertEquals(name, collectionName)
            assertEquals(action, 'count')

            resolve()
          },
        })

        repo.count({})
      }),
  ),
)

Deno.test('should log getById call', () =>
  withDb(
    db =>
      new Promise(resolve => {
        const repo = new MangoRepo<User>(db, collectionName, {
          logger: ({ collectionName: name, action }) => {
            assertEquals(name, collectionName)
            assertEquals(action, 'getById')

            resolve()
          },
        })

        repo.getById(new ObjectId().toHexString())
      }),
  ),
)

Deno.test('should log find call', () =>
  withDb(
    db =>
      new Promise(resolve => {
        const repo = new MangoRepo<User>(db, collectionName, {
          logger: ({ collectionName: name, action }) => {
            assertEquals(name, collectionName)
            assertEquals(action, 'find')

            resolve()
          },
        })

        repo.find({ name: 'test3' })
      }),
  ),
)

Deno.test('should log deleteMany call', () =>
  withDb(
    db =>
      new Promise(resolve => {
        const repo = new MangoRepo<User>(db, collectionName, {
          logger: ({ collectionName: name, action }) => {
            assertEquals(name, collectionName)
            assertEquals(action, 'deleteMany')

            resolve()
          },
        })

        repo.deleteMany({ name: 'test3' })
      }),
  ),
)

export type User = {
  id: string
  name: string
  tag?: string
  zodiac?: string
  age?: number
  temp?: number
}
