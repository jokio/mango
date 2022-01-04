import { withDb } from '../tests/common.ts'
import { assertRejects, assertExists } from '../tests/test.deps.ts'
import { connectMongo } from './connectMongo.ts'

Deno.test('should fire error on empty connectionString', () => {
  assertRejects(
    () => connectMongo(''),
    Error,
    'Invalid connection string',
  )
})

Deno.test('should connect successfully', () =>
  withDb((db, client) => {
    assertExists(db)
    assertExists(client)
  }),
)
