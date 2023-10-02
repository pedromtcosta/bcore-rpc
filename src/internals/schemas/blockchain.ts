import * as iots from 'io-ts';

const undefineable = <T>(type: iots.Type<T>): iots.Type<T | undefined> => iots.union([type, iots.undefined]);

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
    previousblockhash: undefineable(hex),
    nextblockhash: undefineable(hex),
  };

  const scriptPubKeySchema = {
    asm: iots.string,
    desc: iots.string,
    hex: hex,
    address: undefineable(iots.string),
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
    coinbase: undefineable(hex),
    txid: undefineable(hex),
    vout: undefineable(iots.number),
    scriptSig: undefineable(iots.type({
      asm: iots.string,
      hex: iots.union([hex, iots.literal('')]),
    }, 'scriptSig')),
    txinwitness: undefineable(
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
    fee: undefineable(iots.number),
    hex: hex,
  };

  const txVerbosity2 = {
    ...txVerbosity1,
    vin: iots.array(iots.type({
      ...vinSchema,
      prevout: undefineable(iots.type({
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
