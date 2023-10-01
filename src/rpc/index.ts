import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { DefaultError, error } from '../internals/kernel';
import { assertOkResponse, extractResponseBody } from '../internals/fp/fetch';
import { extractResultFromRpcResponse } from '../internals/fp/rpc';
import { RpcCallGoodResponse } from '../internals/schemas/rpc';

export type CallRpcCommand = (method: string, params?: any[]) => TE.TaskEither<DefaultError, RpcCallGoodResponse>;
export const buildCallRpcCommand = (host: string, port:number, {
  protocol = 'http',
  credentials,
}: {
  protocol?: 'http' | 'https'
  credentials: {
    user: string
    password: string
  }
}): CallRpcCommand => {
  const url = credentials
    ? `${protocol}://${credentials.user}:${credentials.password}@${host}:${port}`
    : `${protocol}://${host}:${port}`;

  const headers = {
    'Content-Type': 'application/json',
  } as any;

  if (credentials) {
    headers.Authorization = `Basic ${Buffer.from(`${credentials.user}:${credentials.password}`).toString('base64')}`;
  }

  const tryCatchFetch = (method: string, params: any[] = []) => TE.tryCatch(
    () => fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      }),
    }),
    (e) => error('error making RPC call', e),
  );

  return (method: string, params: any[] = []) => pipe(
    tryCatchFetch(method, params),
    assertOkResponse,
    extractResponseBody,
    extractResultFromRpcResponse
  );
};
