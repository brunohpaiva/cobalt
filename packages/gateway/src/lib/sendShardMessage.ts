import { ClientOpcodes, ClientPayload, CobaltShard } from './types';

export function sendShardMessage<Op extends ClientOpcodes, D>(
  shard: CobaltShard,
  payload: ClientPayload<Op, D>
) {
  // TODO
  shard.ws?.send(JSON.stringify(payload));
}
