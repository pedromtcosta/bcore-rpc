import * as iots from 'io-ts';

const optional = <T>(type: iots.Type<T>): iots.Type<T | undefined> => iots.union([type, iots.undefined]);

const isHexadecimal = (input: string): boolean => /^[0-9A-Fa-f]+$/.test(input);
const hex: iots.Type<string> = new iots.Type<string>(
  'hex',
  (input: unknown): input is string => typeof input === 'string' && isHexadecimal(input),
  (input: unknown, context: iots.Context): iots.Validation<string> =>
    isHexadecimal(input as string)
      ? iots.success(input as string)
      : iots.failure(input, context, 'Input is not a valid hexadecimal string'),
  iots.identity
);


export const getBestBlockHashSchema = hex;

export const getBlockSchema = (() => {
  const verbosity0 = hex;

  const blockSchema = {
    hash: hex,
    confirmations: iots.number,
    size: iots.number,
    strippedsize: iots.number,
    weight: iots.number,
    height: iots.number,
    version: iots.number,
    versionHex: hex,
    merkleroot: hex,
    tx: iots.array(iots.any),
    time: iots.number,
    mediantime: iots.number,
    nonce: iots.number,
    bits: hex,
    difficulty: iots.number,
    chainwork: hex,
    nTx: iots.number,
    previousblockhash: optional(hex),
    nextblockhash: optional(hex),
  };

  const scriptPubKeySchema = {
    asm: iots.string,
    desc: iots.string,
    hex: hex,
    address: optional(iots.string),
    type: iots.union([
      iots.literal('nonstandard'),
      iots.literal('pubkey'),
      iots.literal('pubkeyhash'),
      iots.literal('scripthash'),
      iots.literal('multisig'),
      iots.literal('nulldata'),
      iots.literal('witness_v0_scripthash'),
      iots.literal('witness_v0_keyhash'),
      iots.literal('witness_v1_taproot'),
      iots.literal('witness_unknown'),
    ], 'type'),
  };

  const vinSchema = {
    coinbase: optional(hex),
    txid: optional(hex),
    vout: optional(iots.number),
    scriptSig: optional(iots.type({
      asm: iots.string,
      hex: iots.union([hex, iots.literal('')]),
    }, 'scriptSig')),
    txinwitness: optional(
      iots.array(
        iots.union([iots.literal(''), hex]),
        'txinwitness'
      )
    ),
    sequence: iots.number,
  };

  const txVerbosity1 = {
    txid: hex,
    hash: hex,
    version: iots.number,
    size: iots.number,
    vsize: iots.number,
    weight: iots.number,
    locktime: iots.number,
    vin: iots.array(iots.type(vinSchema, 'vin_item'), 'vin'),
    vout: iots.array(iots.type({
      value: iots.number,
      n: iots.number,
      scriptPubKey: iots.type(scriptPubKeySchema)
    }, 'vout_item'), 'vout'),
    fee: optional(iots.number),
    hex: hex,
  };

  const txVerbosity2 = {
    ...txVerbosity1,
    vin: iots.array(iots.type({
      ...vinSchema,
      prevout: optional(iots.type({
        generated: iots.boolean,
        height: iots.number,
        value: iots.number,
        scriptPubKey: iots.type(scriptPubKeySchema)
      }))
    }, 'vin_item'), 'vin'),
  };
  
  const verbosity1 = iots.type({
    ...blockSchema,
    tx: iots.array(iots.string, 'tx'),
  }, 'block');

  const verbosity2 = iots.type({
    ...blockSchema,
    tx: iots.array(iots.type(txVerbosity1, 'tx'), 'tx'),
  }, 'block');

  const verbosity3 = iots.type({
    ...blockSchema,
    tx: iots.array(iots.type(txVerbosity2, 'tx'), 'tx'),
  }, 'block');

  return {
    variants: {
      verbosity0,
      verbosity1,
      verbosity2,
      verbosity3
    }
  }
})();

export const getBlockchainInfoSchema = iots.type({
  chain: iots.string,
  blocks: iots.number,
  headers: iots.number,
  bestblockhash: hex,
  difficulty: iots.number,
  time: iots.number,
  mediantime: iots.number,
  verificationprogress: iots.number,
  initialblockdownload: iots.boolean,
  chainwork: hex,
  size_on_disk: iots.number,
  pruned: iots.boolean,
  pruneheight: optional(iots.number),
  automatic_pruning: optional(iots.boolean),
  prune_target_size: optional(iots.number),
  warnings: iots.string,
});

export const getBlockCountSchema = iots.number;

export const getBlockFilterSchema = iots.type({
  filter: hex,
  header: hex,
});

export const getBlockFromPeerSchema = iots.any;

export const getBlockHashSchema = hex;

export const getBlockHeaderSchema = (() => {
  const blockHeaderSchema = {
    hash: hex,
    confirmations: iots.number,
    height: iots.number,
    version: iots.number,
    versionHex: hex,
    merkleroot: hex,
    time: iots.number,
    mediantime: iots.number,
    nonce: iots.number,
    bits: hex,
    difficulty: iots.number,
    chainwork: hex,
    nTx: iots.number,
    previousblockhash: optional(hex),
    nextblockhash: optional(hex),
  };

  return {
    variants: {
      verboseFalse: hex,
      verboseTrue: iots.type(blockHeaderSchema, 'blockHeader'),
    }
  }
})();

export const getBlockStatsSchema = iots.type({
  avgfee: iots.number,
  avgfeerate: optional(iots.number),
  avgtxsize: optional(iots.number),
  blockhash: optional(hex),
  feerate_percentiles: optional(iots.array(iots.number, 'feerate_percentiles')),
  height: optional(iots.number),
  ins: optional(iots.number),
  maxfee: optional(iots.number),
  maxfeerate: optional(iots.number),
  maxtxsize: optional(iots.number),
  medianfee: optional(iots.number),
  mediantime: optional(iots.number),
  mediantxsize: optional(iots.number),
  minfee: optional(iots.number),
  minfeerate: optional(iots.number),
  mintxsize: optional(iots.number),
  outs: optional(iots.number),
  subsidy: optional(iots.number),
  swtotal_size: optional(iots.number),
  swtotal_weight: optional(iots.number),
  swtxs: optional(iots.number),
  time: optional(iots.number),
  total_out: optional(iots.number),
  total_size: optional(iots.number),
  total_weight: optional(iots.number),
  totalfee: optional(iots.number),
  txs: optional(iots.number),
  utxo_increase: optional(iots.number),
  utxo_size_inc: optional(iots.number),
  utxo_increase_actual: optional(iots.number),
  utxo_size_inc_actual: optional(iots.number),
});

export const getChainTipsSchema = iots.array(iots.type({
  height: iots.number,
  hash: hex,
  branchlen: iots.number,
  status: iots.union([
    iots.literal('invalid'),
    iots.literal('headers-only'),
    iots.literal('valid-headers'),
    iots.literal('valid-fork'),
    iots.literal('active'),
  ], 'status'),
}));

export const getChainTxStatsSchema = iots.type({
  time: iots.number,
  txcount: iots.number,
  window_final_block_hash: hex,
  window_final_block_height: iots.number,
  window_block_count: iots.number,
  window_tx_count: optional(iots.number),
  window_interval: optional(iots.number),
  txrate: optional(iots.number),
});
