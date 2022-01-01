# 🥭 Mango
Lightweight abstraction layer on top of mongodb driver to provide following features.

## 
[![codecov](https://codecov.io/gh/jokio/mango/branch/master/graph/badge.svg?token=7Gf9AxsXBn)](https://codecov.io/gh/jokio/mango)

## Features

✅ `_id` mapping to `id`

✅ `_id` transformation from `ObjectId` to `string`. So you will work always with strings and mongo will store `ObjectId`. You will not need to worry about conversions any more.

✅ Versioning system can be enabled per collection. `version: number`  and its increased by `1` every time you call update

✅ Doc Dates can be enabled per collection and documents will have `createdAt` and `updatedAt`


<br/>

<br/>

## Basic Example:
```ts
import { connectMongo, MangoRepo } from 'https://deno.land/x/jok_mango@v1.4.0/mod.ts'

type User = {
  name: string
  avatarUrl: string
}

const { db } = await connectMongo('mongo://localhost/test')
const repo = new MangoRepo<User>(
  db,
  'users',
)

const result = await repo.insert({
  name: 'playerx',
  avatarUrl: 'myJokAvatar',
})

console.log(result)
```