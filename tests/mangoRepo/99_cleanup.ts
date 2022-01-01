import { withDb } from '../common.ts'

Deno.test('cleanup', () =>
  withDb(async db => {
    try {
      await db.collection('test').drop()
    } catch (err) {
      console.warn('cleanup issue', err)
    }
  }),
)
