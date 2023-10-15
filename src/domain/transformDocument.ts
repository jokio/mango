import { Bson, Filter, UpdateFilter } from '../../deps.ts'

interface Options {
  idMapping: boolean
  idTransformation: boolean
  docVersioning: boolean
  docDates: boolean
}

export function prepareDocument<TDocument>(
  // deno-lint-ignore no-explicit-any
  doc: any,
  dateNow: Date,
  options: Options,
): TDocument {
  const { docVersioning, docDates } = options

  const {
    // _id: objectId,
    // id,
    // version,
    // createdAt,
    // updatedAt,
    ...data
  } = doc

  const _id = getMongoDocumentId(doc, options)

  // prepare final document
  return {
    ...data,
    _id,
    ...(docVersioning ? { version: 1 } : null),
    ...(docDates ? { createdAt: dateNow } : null),
  }
}

export function getMongoDocumentId<TDocument>(
  doc: TDocument,
  options: Options,
): Bson.ObjectId | string {
  const { idMapping, idTransformation } = options

  // deno-lint-ignore no-explicit-any
  const { _id: objectId, id } = doc as any

  let _id = objectId

  if (idMapping) {
    _id = id
  }

  if (idTransformation) {
    _id = new Bson.ObjectId(_id)
  }

  return _id
}

export function transformDocumentBack<TDocument>(
  doc: TDocument,
  options: Options,
): TDocument {
  const { idMapping, idTransformation } = options

  // deno-lint-ignore no-explicit-any
  let result = doc as any

  if (idTransformation) {
    const { _id, ...rest } = result

    const objectId = _id as Bson.ObjectId

    result = {
      ...rest,
      _id: objectId.toHexString(),
    }
  }

  if (idMapping) {
    const { _id, ...rest } = result

    result = {
      ...rest,
      id: _id,
    }
  }

  return result
}

export function prepareFilter<TDocument>(
  filter: Filter<TDocument>,
  options: Options,
): Filter<TDocument> {
  const { idMapping, idTransformation } = options

  let result = filter

  if (idMapping) {
    const { id, ...rest } = result

    if (id) {
      result = { ...rest, _id: id }
    }
  }

  if (idTransformation) {
    const { _id } = result

    if (_id) {
      switch (typeof _id) {
        case 'string':
          result = {
            ...result,
            _id: new Bson.ObjectId(_id),
          }
          break

        case 'object':
          {
            result = {
              ...result,
              _id: Object.fromEntries(
                Object.entries(_id).map(([key, value]) => [
                  key,
                  value
                    ? Array.isArray(value)
                      ? value.map(x => mapToObjectId(x))
                      : mapToObjectId(value)
                    : value,
                ]),
              ),
            }
          }
          break
      }
    }
  }

  return result
}

function mapToObjectId(value: unknown) {
  if (typeof value === 'string' && value.length === 24) {
    return new Bson.ObjectId(value)
  }

  return value
}

export function prepareUpdateFilter<TDocument>(
  query: UpdateFilter<TDocument>,
  dateNow: Date,
  options: Options,
): UpdateFilter<TDocument> {
  const { docVersioning, docDates } = options

  let result = query

  if (docVersioning) {
    result = {
      ...result,

      $inc: {
        ...query.$inc,
        version: 1,
      } as any,
    }
  }

  if (docDates) {
    result = {
      ...result,

      $set: {
        ...query.$set,
        updatedAt: dateNow,
      } as any,
    }
  }

  return result
}
