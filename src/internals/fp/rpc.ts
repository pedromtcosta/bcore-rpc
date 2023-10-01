import * as TE from 'fp-ts/lib/TaskEither';
import { error } from '../kernel';
import { pipe } from 'fp-ts/lib/function';
import { rpcCallGoodResponseSchema } from '../schemas/rpc';
import { decodeAndReportWhenError } from './io';

export const extractResultFromRpcResponse = TE.chain((r: any) => pipe(
  decodeAndReportWhenError(rpcCallGoodResponseSchema, r),
  TE.fold(
    (e) => TE.left(error('response from RPC call does not match expected schema', e)),
    (r) => TE.right(r.result),
  )
));
