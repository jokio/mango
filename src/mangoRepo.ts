import {
  Bson,
  Database,
  DeleteOptions,
  Filter,
  FindAndModifyOptions,
  FindOptions,
  UpdateFilter,
  UpdateOptions,
} from '../deps.ts'
import {
  prepareDocument,
  prepareFilter,
  prepareUpdateFilter,
  transformDocumentBack,
} from './domain/transformDocument.ts'
import { Data, MangoLoggerFn, WithOptionalId } from './types.ts'

export interface MangoRepoOptions {
  /**
   * move `_id` value into `id` field
   *
   * @default true
   */
  idMapping?: boolean

  /**
   * transform ObjectId into string and vice-versa
   *
   * always applies to the _id field
   *
   * @default true
   */
  idTransformation?: boolean

  /**
   * The latest version of the document will be returned after update
   *
   * @default true
   */
  returnLatestDocumentByDefault?: boolean

  /**
   * Adds `version: number` to the document and inc's it on every update
   *
   * @default false
   */
  docVersioning?: boolean

  /**
   * Adds `createdAt` & `updatedAt` dates to the document and sets them automatically
   *
   * `updatedAt` will be undefined until the document will be updated
   *
   * @default false
   */
  docDates?: boolean

  /**
   * NOT SUPPORTED YET
   * Session can be passed for transactions
   */
  session?: null

  /**
   * logger function will be fired on every operation
   *
   * The only exception is when you use `collection` property
   */
  logger?: MangoLoggerFn | null
}

/**
 * Repository to work with mongodb
 */
export class MangoRepo<TDocument> {
  protected options: Required<MangoRepoOptions>

  get collection() {
    return this.db.collection<TDocument>(this.collectionName)
  }

  constructor(
    protected db: Database,
    protected collectionName: string,
    options?: MangoRepoOptions,
  ) {
    const defaultOptions: Required<MangoRepoOptions> = {
      idMapping: true,
      idTransformation: true,
      returnLatestDocumentByDefault: true,
      docVersioning: false,
      docDates: false,
      logger: null,
      session: null,
    }

    this.options = {
      ...defaultOptions,
      ...options,
    }
  }

  async insert(
    doc: WithOptionalId<Data<TDocument>>,
  ): Promise<TDocument> {
    const { logger } = this.options

    const now = new Date()

    // prepare final document
    const finalDoc = prepareDocument<TDocument>(
      doc,
      now,
      this.options,
    )

    const insertedId = await this.collection.insertOne(finalDoc)

    if (!insertedId) {
      throw new Error('MANGO_CREATE_ONE_FAILED')
    }

    const finalResult = transformDocumentBack<TDocument>(
      finalDoc,
      this.options,
    )

    if (logger) {
      const duration = Date.now() - now.getTime()

      logger({
        collectionName: this.collectionName,
        action: 'insertOne',
        duration,
      })
    }

    return finalResult
  }

  async insertMany(
    docs: WithOptionalId<Data<TDocument>>[],
  ): Promise<string[]> {
    const { logger } = this.options

    const now = new Date()

    const finalDocs = docs.map(doc =>
      prepareDocument<TDocument>(doc, now, this.options),
    )

    const { insertedIds, insertedCount } =
      await this.collection.insertMany(finalDocs)

    if (insertedCount !== docs.length) {
      throw new Error('MANGO_CREATE_MANY_FAILED')
    }

    if (logger) {
      const duration = Date.now() - now.getTime()

      logger({
        collectionName: this.collectionName,
        action: 'insertMany',
        duration,
      })
    }

    // deno-lint-ignore no-explicit-any
    return insertedIds.map((x: any) => x.toString())
  }

  async count(filter: Filter<TDocument> = {}) {
    const { logger } = this.options

    const now = new Date()

    const finalFilter = prepareFilter(filter, this.options)

    const result = await this.collection.countDocuments(finalFilter)

    if (logger) {
      const duration = Date.now() - now.getTime()

      logger({
        collectionName: this.collectionName,
        action: 'count',
        filter,
        duration,
      })
    }

    return result
  }

  async updateOne(
    filter: Filter<TDocument>,
    updateQuery: UpdateFilter<Data<TDocument>>,
    options?: FindAndModifyOptions,
  ): Promise<TDocument | null> {
    const { logger, returnLatestDocumentByDefault } = this.options

    const now = new Date()

    const finalFilter = prepareFilter(filter, this.options)

    // deno-lint-ignore no-explicit-any
    const finalUpdateFilter: any = prepareUpdateFilter(
      updateQuery,
      now,
      this.options,
    )

    const value = await this.collection.findAndModify(finalFilter, {
      new: returnLatestDocumentByDefault,
      ...options,
      update: finalUpdateFilter,
    })

    if (logger) {
      const duration = Date.now() - now.getTime()

      logger({
        collectionName: this.collectionName,
        action: 'updateOne',
        filter,
        duration,
      })
    }

    const finalResult = value
      ? transformDocumentBack<TDocument>(value, this.options)
      : null

    return finalResult
  }

  async updateMany(
    filter: Filter<TDocument>,
    updateQuery: UpdateFilter<Data<TDocument>>,
    options?: UpdateOptions,
  ): Promise<number> {
    const { logger } = this.options

    const now = new Date()

    const finalFilter = prepareFilter(filter, this.options)

    // deno-lint-ignore no-explicit-any
    const finalUpdateQuery: any = prepareUpdateFilter(
      updateQuery,
      now,
      this.options,
    )

    const { matchedCount } = await this.collection.updateMany(
      finalFilter,
      finalUpdateQuery,
      options,
    )

    if (logger) {
      const duration = Date.now() - now.getTime()

      logger({
        collectionName: this.collectionName,
        action: 'updateMany',
        filter,
        duration,
      })
    }

    return matchedCount
  }

  async deleteMany(
    filter: Filter<TDocument>,
    options?: DeleteOptions,
  ): Promise<number> {
    const { logger } = this.options

    const now = new Date()

    const finalFilter = prepareFilter(filter, this.options)

    const deletedCount = await this.collection.deleteMany(
      finalFilter,
      options,
    )

    if (logger) {
      const duration = Date.now() - now.getTime()

      logger({
        collectionName: this.collectionName,
        action: 'deleteMany',
        filter,
        duration,
      })
    }

    return deletedCount
  }

  async getById(
    id: string | Bson.ObjectId,
  ): Promise<TDocument | null> {
    const { idTransformation, logger } = this.options

    const now = new Date()

    const value = idTransformation ? new Bson.ObjectId(id) : id

    // deno-lint-ignore no-explicit-any
    const filter: any = { _id: value }

    const doc = await this.collection.findOne(filter, {
      // findOne: true,
    })

    const result = doc
      ? transformDocumentBack<TDocument>(doc, this.options)
      : null

    if (logger) {
      const duration = Date.now() - now.getTime()

      logger({
        collectionName: this.collectionName,
        action: 'getById',
        duration,
      })
    }

    return result
  }

  async find(
    filter: Filter<TDocument>,
    options?: FindOptions,
  ): Promise<TDocument[]> {
    const { logger } = this.options

    const now = new Date()

    const finalFilter = prepareFilter(filter, this.options)

    const result = await this.collection
      .find(finalFilter, options)
      .toArray()

    const finalResult: TDocument[] = result.map(x =>
      transformDocumentBack(x, this.options),
    )

    if (logger) {
      const duration = Date.now() - now.getTime()

      logger({
        collectionName: this.collectionName,
        action: 'query',
        filter,
        duration,
      })
    }

    return finalResult
  }
}
