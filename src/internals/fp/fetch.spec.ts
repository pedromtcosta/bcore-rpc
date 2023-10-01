import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { assertOkResponse, extractResponseBody } from "./fetch";
import { assertEitherValue } from '../../../spec/utils';

describe('FP fetch', () => {
  describe('assertOkResponse', () => {
    it('success', async () => {
      // arrange
      const response = new Response(null, {
        status: 200,
        statusText: 'OK'
      });
  
      // act
      const r = await assertOkResponse(TE.right(response))();
  
      // assert
      expect(E.isRight(r)).toBe(true);
    });

    it('fail', async () => {
      // arrange
      const response = new Response(null, {
        status: 400,
        statusText: 'Not Ok'
      });
  
      // act
      const r = await assertOkResponse(TE.right(response))();
  
      // assert
      expect(E.isRight(r)).toBe(false);
    });
  });

  describe('extractResponseBody', () => {
    it('success', async () => {
      // arrange
      const response = new Response(JSON.stringify({
        foo: 'bar'
      }), {
        status: 200,
        statusText: 'OK'
      });
  
      // act
      const r = await extractResponseBody(TE.right(response))();
  
      // assert
      assertEitherValue(expect)(r, {
        foo: 'bar'
      });
    });
  });
});