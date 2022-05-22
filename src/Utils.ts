// export const request = (
//   input: RequestInfo,
//   init?: RequestInit,
// ): RTE.ReaderTaskEither<HttpClientEnv, HttpRequestError, Response> =>
//   pipe(
//     RTE.asks<HttpClientEnv, never, HttpClient>(
//       (env: HttpClientEnv) => env.httpClient,
//     ),
//     RTE.chainTaskEitherKW((httpClient: HttpClient) =>
//       httpClient.request(input, init)
//     ),
//   )
export {}
