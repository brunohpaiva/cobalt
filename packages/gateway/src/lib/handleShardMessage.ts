import { logger } from '../logger';
import { CobaltShard, ServerOpcodes, ServerPayload } from './types';

// TODO: typings
export function handleShardMessage<Op extends ServerOpcodes, D>(
  shard: CobaltShard,
  payload: ServerPayload<Op, D>
) {
  logger.log('debug', 'Received message for shard %d: %o', shard.id, payload);
}
