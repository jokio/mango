import { withDb } from '../common.ts'

Deno.test('cleanup', () =>
  withDb(async db => {
    await db.collection('test').drop()
  }),
)
