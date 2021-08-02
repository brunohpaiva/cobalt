export interface CobaltGatewayConfig {
  botToken: string;
  gatewayUrl?: string;
  shardsCount?: number;
  shardsPerCluster: number;
}

export interface CobaltShard {
  id: number;
}

export interface CobaltCluster {
  id: number;
  shards: CobaltShard[];
}

export interface CobaltBucket {
  id: number;
  clusters: CobaltCluster[];
}

export interface CobaltGatewayState {
  gatewayUrl: string;
  recommendedShardsCount: number;
  buckets: CobaltBucket[];
}

export interface DApiGatewayBot {
  url: string;
  shards: number;
  session_start_limit: {
    total: number;
    remaining: number;
    reset_after: number;
    max_concurrency: number;
  };
}
