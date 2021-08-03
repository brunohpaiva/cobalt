import { logger } from '../logger';
import { CobaltShard } from './types';

// TODO: typings
export function handleShardMessage(shard: CobaltShard, data: any) {
  logger.log('debug', 'Received message for shard %d: %o', shard.id, data);
}
