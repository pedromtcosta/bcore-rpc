import * as E from 'fp-ts/lib/Either';
import { buildCallRpcCommand } from ".";
import * as dotenv from 'dotenv';

dotenv.config();

describe.skip('rpc', () => {
  it('should execute RPC commands', async () => {
    const host = process.env.RPC_HOST!;
    const portStr = process.env.RPC_PORT!;
    const user = process.env.RPC_USER!;
    const password = process.env.RPC_PASSWORD!;

    const callRpcCommand = buildCallRpcCommand(
      host,
      parseInt(portStr), {
      credentials: {
        user,
        password,
      },
    });

    const response = await callRpcCommand('getbestblockhash')();
    if (E.isLeft(response)) {
      console.log(response.left);
    }

    expect(E.isRight(response)).toBeTruthy();
  });
});