import { assertRejects, assertExists } from '../tests/test.deps.ts'
import { connectMongo } from './connectMongo.ts'

Deno.test('should fire error on empty connectionString', () => {
  assertRejects(
    () => connectMongo(''),
    Error,
    'Invalid connection string',
  )
})

Deno.test('should fire error on null connectionString', () => {
  assertRejects(
    // deno-lint-ignore no-explicit-any
    () => connectMongo(null as any),
    Error,
    'Invalid connection string',
  )

  assertRejects(
    // deno-lint-ignore no-explicit-any
    () => connectMongo(undefined as any),
    Error,
    'Invalid connection string',
  )
})

Deno.test('should connects successfully', async () => {
  const result = await connectMongo('mongo://127.0.0.1/test')
  assertExists(result)
  assertExists(result.client)
  assertExists(result.db)

  await result.client.close()
})
