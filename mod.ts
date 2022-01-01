import { Bson } from './deps.ts'

export { MangoRepo } from './src/mangoRepo.ts'
export type { MangoRepoOptions } from './src/mangoRepo.ts'
export { connectMongo } from './src/connectMongo.ts'
export const ObjectId = Bson.ObjectId
export type ObjectId = Bson.ObjectId
export type {
  MangoDocumentDates,
  MangoDocumentVersion,
  MangoLoggerFn,
} from './src/types.ts'
