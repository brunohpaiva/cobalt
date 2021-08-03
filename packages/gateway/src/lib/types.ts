import * as WebSocket from 'ws';

export interface CobaltGatewayConfig {
  botToken: string;
  connection?: Partial<GatewayConnectionConfig>;
  shardsCount?: number;
  shardsPerCluster: number;
  intents?: Intent[];
}

export type GatewayVersion = '6' | '8' | '9';

export interface GatewayConnectionConfig {
  url: string;
  version: GatewayVersion;
  encoding: 'json' | 'etf';
  compress?: 'zlib-stream' | false;
}

export enum Intent {
  GUILDS = 1 << 0,
  GUILD_MEMBERS = 1 << 1,
  GUILD_BANS = 1 << 2,
  GUILD_EMOJIS_AND_STICKERS = 1 << 3,
  GUILD_INTEGRATIONS = 1 << 4,
  GUILD_WEBHOOKS = 1 << 5,
  GUILD_INVITES = 1 << 6,
  GUILD_VOICE_STATES = 1 << 7,
  GUILD_PRESENCES = 1 << 8,
  GUILD_MESSAGES = 1 << 9,
  GUILD_MESSAGE_REACTIONS = 1 << 10,
  GUILD_MESSAGE_TYPING = 1 << 11,
  DIRECT_MESSAGES = 1 << 12,
  DIRECT_MESSAGE_REACTIONS = 1 << 13,
  DIRECT_MESSAGE_TYPING = 1 << 14,
}

export interface CobaltShard {
  id: number;
  ws?: WebSocket;
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
  connection: GatewayConnectionConfig;
  recommendedShardsCount: number;
  intentsBit: number;
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
