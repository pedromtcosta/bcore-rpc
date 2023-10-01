import * as iots from 'io-ts';

export const rpcCallGoodResponseSchema = iots.type({
  result: iots.any,
  id: iots.number,
  error: iots.null,
}, 'rpcCallGoodResponse');
export type RpcCallGoodResponse = iots.TypeOf<typeof rpcCallGoodResponseSchema>;
