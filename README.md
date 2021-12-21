# 🥭 Mango

## Features

✅ Stores `_id: ObjectId` field, but wraps it to the `id: string`

✅ Documents have `version: number` out of the box, and its increased by `1`
every time you call update

✅ Every document has `createdAt` and `updatedAt` props

✅ Soft Delete & Hard Delete ability for documents

<br/>

<br/>

## Example:
```ts
import {
  connectMongo,
  MangoRepo,
} from 'https://deno.land/x/jok_mango@v0.1.1/mod.ts'

const { db } = await connectMongo('mongo://localhost/test')
const repo = new MangoRepo<{ name: string; avatarUrl: string }>(
  db,
  'users',
)

const result = await repo.insertOne({
  name: 'playerx',
  avatarUrl: 'myJokAvatar',
})

console.log(result)
```