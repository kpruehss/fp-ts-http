import * as TE from 'fp-ts/lib/TaskEither'
import * as IO from 'fp-ts/lib/IO'
import * as O from 'fp-ts/lib/Option';
//
// export const ResponseValidator = io.type({
//   body: io.string,
//   email: io.string,
//   id: io.number,
//   name: io.string,
//   postId: io.number
// })
//
// export const ResponseArrayValidator = io.array(ResponseValidator)
//
// export type IResponse = io.TypeOf<typeof ResponseValidator>;
// export type IResponseArray = io.TypeOf<typeof ResponseArrayValidator>;

export type HttpRequestError = {
  tag: 'httpRequestError',
  error: unknown
}

export type HttpContentTypeError = {
  tag: 'httpContentTypeError',
  error: unknown
}

export type HttpResponseStatusError = {
  tag: 'httpResponseStatusError',
  status: number
}

export interface HttpClient {
  request(
    input: RequestInfo,
    init?: RequestInit,
  ): TE.TaskEither<HttpRequestError, Response>
}

// RTE "module" interface - for composing with other dependencies
export interface HttpClientEnv {
  httpClient: HttpClient
}

// "live" implementation backed by fetch
const fetchHttpClient: HttpClient = {
  request: (input, init) => TE.tryCatch(
    () => fetch(input, init),
    (e: any) => ({
      tag: 'httpRequestError',
      error: e
    })
  )
}

//------------------------------------------------------------------------------

// localStorage
export interface Storage {
  getItem(key: string): IO.IO<O.Option<string>>

  setItem(key: string, value: string): IO.IO<void>
}

// RTE "module" interface - for composing with other dependencies
interface StorageEnv {
  storage: Storage
}

// Implementation with DOM localStorage
export const domStorage: Storage = {
  getItem: (key) => () => O.fromNullable(localStorage.getItem(key)),
  setItem: (key, value) => () => localStorage.setItem(key, value)
}

export const httpClientEnv: HttpClientEnv = {httpClient: fetchHttpClient}
export const storageEnv: StorageEnv = {storage: domStorage}

type AppEnv = HttpClientEnv & StorageEnv // & other env types

const appEnv: AppEnv = {...httpClientEnv, ...storageEnv}
//------------------------------------------------------------------------------

