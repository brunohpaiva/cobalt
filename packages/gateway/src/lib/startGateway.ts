import { prepareBuckets } from './prepareBuckets';
import {
  CobaltGatewayConfig,
  CobaltGatewayState,
  DApiGatewayBot,
  GatewayVersionString,
} from './types';
import { get } from '@cobalt/http';
import { logger } from '../logger';
import { startShard } from './startShard';

const DEFAULT_GATEWAY_VERSION: GatewayVersionString = '9';

export async function startGateway(config: CobaltGatewayConfig) {
  const state = {} as CobaltGatewayState;

  const gatewayInfo = await get<DApiGatewayBot>(config.botToken, 'gateway/bot');
  // TODO: error handling

  state.botToken = config.botToken;
  state.connection = {
    url: config.connection?.url ?? gatewayInfo.url,
    version: config.connection?.version ?? DEFAULT_GATEWAY_VERSION,
    encoding: config.connection?.encoding ?? 'json',
    compress: config.connection?.compress ?? 'zlib-stream',
  };
  logger.log(
    'info',
    'Gateway connection: URL "%s" Version "%s" Encoding "%s" Compression "%s"',
    state.connection.url,
    state.connection.version,
    state.connection.encoding,
    state.connection.compress
  );

  state.recommendedShardsCount = config.shardsCount ?? gatewayInfo.shards;
  logger.log(
    'info',
    'Recommended Shards count: %d',
    state.recommendedShardsCount
  );

  state.buckets = prepareBuckets(
    state.recommendedShardsCount,
    config.shardsPerCluster,
    gatewayInfo.session_start_limit.max_concurrency
  );

  const intents = config.intents ?? [];
  state.intentsBit = intents.reduce((prev, curr) => (prev |= curr), 0);

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

        startShard(shard, state);
      }
    }
  }
}
