import { assertEquals } from '../../tests/test.deps.ts'
import { buildConnectionString } from './buildConnectionString.ts'

Deno.test('should have authSource', () => {
  const result = buildConnectionString(
    'mongodb://localhost:27017',
    '',
  )

  assertEquals(result.indexOf('?authSource=admin') > -1, true)
})

Deno.test('should have authSource with another param', () => {
  const result = buildConnectionString(
    'mongodb://localhost:27017?something=1',
    '',
  )

  assertEquals(result.indexOf('&authSource=admin') > -1, true)
})

Deno.test('should have authMechanism', () => {
  const result = buildConnectionString(
    'mongodb://localhost:27017',
    'T1',
  )

  assertEquals(result.indexOf('?authMechanism=T1') > -1, true)
})

Deno.test('should have authMechanism with another param', () => {
  const result = buildConnectionString(
    'mongodb://localhost:27017?something=1',
    'T1',
  )

  assertEquals(result.indexOf('&authMechanism=T1') > -1, true)
})
