import { prepareBuckets } from './prepareBuckets';
import {
  CobaltGatewayConfig,
  CobaltGatewayState,
  DApiGatewayBot,
} from './types';
import { get } from '@cobalt/http';
import { logger } from '../logger';

export async function startGateway(config: CobaltGatewayConfig) {
  const state = {} as CobaltGatewayState;

  const gatewayInfo = await get<DApiGatewayBot>(config.botToken, 'gateway/bot');
  // TODO: error handling

  state.gatewayUrl = config.gatewayUrl ?? gatewayInfo.url;
  logger.log('info', 'Gateway URL: %s', state.gatewayUrl);

  state.recommendedShardsCount = config.shardsCount ?? gatewayInfo.shards;
  logger.log(
    'info',
    'Recommended Shards count: %d',
    state.recommendedShardsCount
  );

  state.buckets = await prepareBuckets(
    state.recommendedShardsCount,
    config.shardsPerCluster,
    gatewayInfo.session_start_limit.max_concurrency
  );

  for (const bucket of state.buckets) {
    logger.log('info', 'Starting bucket %d', bucket.id);

    for (const cluster of bucket.clusters) {
      logger.log(
        'info',
        'Starting cluster %d from bucket %d',
        cluster.id,
        bucket.id
      );

      for (const shard of cluster.shards) {
        logger.log(
          'info',
          'Starting shard %d from cluster %d from bucket %d',
          shard.id,
          cluster.id,
          bucket.id
        );

        // TODO: start shard
      }
    }
  }
}
