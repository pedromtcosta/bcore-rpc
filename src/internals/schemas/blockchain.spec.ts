import * as iots from 'io-ts';
import { assertEitherValue } from "../../../spec/utils";
import { getBestBlockHashSchema, getBlockCountSchema, getBlockFilterSchema, getBlockHeaderSchema, getBlockSchema, getBlockStatsSchema, getBlockchainInfoSchema, getChainTipsSchema } from "./blockchain";
import fs from 'fs';
import path from 'path';

const assertSchema = (expect: jest.Expect) => (schema: iots.Type<any>, fileName: string) => {
  const v = JSON.parse(fs.readFileSync(path.join(__dirname, 'mocked-data', fileName), 'utf8'));
  const parsed = schema.decode(v);

  assertEitherValue(expect)(parsed, v);
};

describe('Blockchain Schemas', () => {
  it('getbestblockhash', () => {
    const bestBlockHash = '0000000000000000000a9f1b3b2b1b0b2b3b4b5b6b7b8b9ba';
    const parsed = getBestBlockHashSchema.decode(bestBlockHash);

    assertEitherValue(expect)(parsed, bestBlockHash);
  });

  describe('getblock', () => {
    it('verbosity 0', () => {
      assertSchema(expect)(getBlockSchema.variants.verbosity0, 'getblock-verbosity-0.json');
    });

    it('verbosity 1', () => {
      assertSchema(expect)(getBlockSchema.variants.verbosity1, 'getblock-verbosity-1.json');
    });

    it('verbosity 2', () => {
      assertSchema(expect)(getBlockSchema.variants.verbosity2, 'getblock-verbosity-2.json');
    });

    it('verbosity 3', () => {
      assertSchema(expect)(getBlockSchema.variants.verbosity3, 'getblock-verbosity-3.json');
    });
  });

  it('getblockchaininfo', () => {
    assertSchema(expect)(getBlockchainInfoSchema, 'getblockchaininfo.json');
  });

  it('getBlockCount', () => {
    const blockCount = 123456;
    const parsed = getBlockCountSchema.decode(blockCount);

    assertEitherValue(expect)(parsed, blockCount);
  });

  it('getblockfilter', () => {
    assertSchema(expect)(getBlockFilterSchema, 'getblockfilter.json');
  });

  describe('getBlockHeader', () => {
    it('verbose false', () => {
      const header = '0000000000000000000a9f1b3b2b1b0b2b3b4b5b6b7b8b9ba';
      const parsed = getBlockHeaderSchema.variants.verboseFalse.decode(header);

      assertEitherValue(expect)(parsed, header);
    });

    it('verbose true', () => {
      assertSchema(expect)(getBlockHeaderSchema.variants.verboseTrue, 'getblockheader-verbose-true.json');
    });
  });

  it('getBlockStats', () => {
    assertSchema(expect)(getBlockStatsSchema, 'getblockstats.json');
  });

  it('getChainTips', () => {
    assertSchema(expect)(getChainTipsSchema, 'getchaintips.json');
  });
});