import * as TE from 'fp-ts/lib/TaskEither';
import { buildCallRpcCommand } from "./rpc";

export const buildBitcoinCoreRpc = (host: string, port:number, {
  protocol = 'http',
  credentials,
}: {
  protocol?: 'http' | 'https'
  credentials: {
    user: string
    password: string
  }
}) => {
  const callRpcCommand = buildCallRpcCommand(host, port, {
    protocol,
    credentials,
  });

  const tryCatchRpcCommand = (method: string, params: any[] = []) => TE.tryCatch(
    () => callRpcCommand(method, params),
    (e) => new Error(String(e)),
  );
};