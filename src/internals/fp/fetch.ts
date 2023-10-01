import * as TE from 'fp-ts/lib/TaskEither';
import { error } from '../kernel';

export const assertOkResponse = TE.chainFirst(TE.fromPredicate((r: Response) => r.ok, r => error('RPC call failed', r.statusText)));
export const extractResponseBody = TE.chain((r: Response) => {
  return TE.tryCatch(() => r.json(), e => error('error extracting body from RPC call response', e))
});
