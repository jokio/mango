# 🥭 Mango
Lightweight abstraction layer on top of mongodb driver to provide following features.

## Features

✅ `_id` mapping to `id`

✅ `_id` transformation from `ObjectId` to `string`. So you will work always with strings and mongo will store `ObjectId`. You will not need to worry about conversions any more.

✅ Versioning system can be enabled per collection. `version: number`  and its increased by `1` every time you call update

✅ Doc Dates can be enabled per collection and documents will have `createdAt` and `updatedAt`


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