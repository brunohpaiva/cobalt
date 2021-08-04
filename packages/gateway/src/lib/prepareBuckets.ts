import { CobaltBucket } from './types';

export function prepareBuckets(
  totalShards: number,
  shardsPerCluster: number,
  maxConcurrency: number
): CobaltBucket[] {
  const buckets: CobaltBucket[] = [];

  for (
    let shardId = 0, bucketId = 0, clusterId = 0;
    shardId < totalShards;
    shardId++
  ) {
    const rateLimitKey = shardId % maxConcurrency;

    let bucket = buckets.find((bucket) => bucket.id === bucketId);
    if (!bucket) {
      bucket = { id: bucketId, clusters: [] };
      buckets.push(bucket);
    }

    let cluster = bucket.clusters.find(
      (cluster) => cluster.shards.length < shardsPerCluster
    );

    if (!cluster) {
      cluster = { id: clusterId++, shards: [] };
      bucket.clusters.push(cluster);
    }

    cluster.shards.push({
      id: shardId,
    });

    if (rateLimitKey + 1 === maxConcurrency) {
      bucketId++;
    }
  }

  return buckets;
}
