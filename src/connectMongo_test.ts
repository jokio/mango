import { assertRejects } from '../tests/test.deps.ts'
import { connectMongo } from './connectMongo.ts'

Deno.test('should fire error on empty connectionString', () => {
  assertRejects(
    () => connectMongo(''),
    Error,
    'Invalid connection string',
  )
})
