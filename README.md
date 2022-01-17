# 🥭 Mango
Lightweight repository abstraction layer on top of the mongodb driver to provide missing features. It has never been so delicious working with `mongo`.


## 
[![codecov](https://codecov.io/gh/jokio/mango/branch/main/graph/badge.svg?token=7Gf9AxsXBn)](https://codecov.io/gh/jokio/mango)

## Features

✅ `_id` mapping to `id`. In mongo it's not possible to use id instead of _id, this feature automatically maps id field for you (enabled by default).

✅ `_id` transformation from `ObjectId` to `string`. So you will work with strings always and `ObjectId` will be stored in mongo for you. You will not need to worry about conversions any more once it's enabled (enabled by default).

✅ Versioning system can be enabled per collection. `version: number`  and its increased by `1` every time you call update. Can be used for optimistic concurency.

✅ Doc Dates can be enabled per collection and documents will have `createdAt` and `updatedAt`.


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

## Advanced Examples:
Check out [tests/mangoRepo](https://github.com/jokio/mango/tree/main/tests/mangoRepo)
