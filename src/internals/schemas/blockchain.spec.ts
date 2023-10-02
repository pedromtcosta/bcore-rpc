import { PathReporter } from "io-ts/lib/PathReporter";
import { assertEitherValue } from "../../../spec/utils";
import { getBestBlockHashSchema, getBlockSchema } from "./blockchain";
import fs from 'fs';
import path from 'path';

describe('Blockchain Schemas', () => {
  it('getbestblockhash', () => {
    const bestBlockHash = '0000000000000000000a9f1b3b2b1b0b2b3b4b5b6b7b8b9ba';
    const parsed = getBestBlockHashSchema.decode(bestBlockHash);

    assertEitherValue(expect)(parsed, bestBlockHash);
  });

  describe('getblock', () => {
    it('verbosity 0', () => {
      const block = fs.readFileSync(path.join(__dirname, 'mocked-data/getblock-verbosity-0.txt'), 'utf8');
      const parsed = getBlockSchema.variants.verbosity0.decode(block);

      assertEitherValue(expect)(parsed, block);
    });

    it('verbosity 1', () => {
      const block = JSON.parse(fs.readFileSync(path.join(__dirname, 'mocked-data/getblock-verbosity-1.json'), 'utf8'));
      const parsed = getBlockSchema.variants.verbosity1.decode(block);

      assertEitherValue(expect)(parsed, block);
    });

    it('verbosity 2', () => {
      const block = JSON.parse(fs.readFileSync(path.join(__dirname, 'mocked-data/getblock-verbosity-2.json'), 'utf8'));
      const parsed = getBlockSchema.variants.verbosity2.decode(block);

      assertEitherValue(expect)(parsed, block);
    });

    it('verbosity 3', () => {
      const block = JSON.parse(fs.readFileSync(path.join(__dirname, 'mocked-data/getblock-verbosity-3.json'), 'utf8'));
      const parsed = getBlockSchema.variants.verbosity3.decode(block);

      assertEitherValue(expect)(parsed, block);
    });
  });
});