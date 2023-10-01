import iots from 'io-ts';
import { PathReporter } from 'io-ts/lib/PathReporter';
import * as TE from 'fp-ts/lib/TaskEither';
import * as E from 'fp-ts/lib/Either';
import { error } from '../kernel';
import { pipe } from 'fp-ts/lib/function';
import { rpcCallGoodResponseSchema } from '../schemas/rpc';

export const decodeAndReportWhenError = <I, A>(decoder: iots.Decoder<I, A>, v: any) => pipe(
  TE.Do,
  TE.chain(() => {
    const validation = decoder.decode(v);
    
    if (E.isLeft(validation)) {
      return TE.left(PathReporter.report(validation));
    }

    return TE.right(validation.right);
  }),
)