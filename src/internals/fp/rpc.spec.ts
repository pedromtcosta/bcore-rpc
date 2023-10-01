import * as TE from 'fp-ts/lib/TaskEither';
import { extractResultFromRpcResponse } from "./rpc";
import { assertEitherError, assertEitherValue } from '../../../spec/utils';

describe('fp RPC', () => {
  describe('extractResultFromRpcResponse', () => {
    it('good RPC response', async () => {
      // arrange
      const response = {
        result: {
          foo: 'bar',
        },
        id: 1,
        error: null,
      }

      // act
      const r = await extractResultFromRpcResponse(TE.right(response))();

      // assert
      assertEitherValue(expect)(r, response.result);
    });

    it('bad RPC response', async () => {
      // arrange
      const response = {
        result: {
          foo: 'bar',
        },
        id: 1,
        error: "some error",
      }

      // act
      const r = await extractResultFromRpcResponse(TE.right(response))();

      // assert
      assertEitherError(expect)(r, {
        message: 'response from RPC call does not match expected schema',
        error: [
          'Invalid value "some error" supplied to : rpcCallGoodResponse/error: null'
        ]
      });
    });
  });
});