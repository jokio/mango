import { Bson, Filter } from '../deps.ts'

export type Data<T> = Omit<
  T,
  '_id' | 'id' | keyof MangoDocumentVersion | keyof MangoDocumentDates
>

export type MangoDocumentVersion = {
  version: number
}

export type MangoDocumentDates = {
  createdAt: Date
  updatedAt?: Date
}

export type MangoLoggerFn = (data: {
  collectionName: string
  action: string
  filter?: Filter<any>
  duration: number
}) => void

export type WithOptionalId<T> = T & { id?: string | Bson.ObjectId }
