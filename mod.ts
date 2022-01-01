import {Bson} from './deps.ts'

export { MangoRepo, type MangoRepoOptions } from './src/mangoRepo.ts'
export { connectMongo } from './src/connectMongo.ts'
export const ObjectId = Bson.ObjectId
export type ObjectId = Bson.ObjectId