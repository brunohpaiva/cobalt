import * as WebSocket from 'ws';

export interface CobaltGatewayConfig {
  botToken: string;
  connection?: Partial<GatewayConnectionConfig>;
  shardsCount?: number;
  shardsPerCluster: number;
  intents?: Intent[];
}

export type GatewayVersionString = '6' | '8' | '9';

export type GatewayVersionNumber = 6 | 8 | 9;

export interface GatewayConnectionConfig {
  url: string;
  version: GatewayVersionString;
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
  botToken: string;
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

export enum ClientOpcodes {
  HEARTBEAT = 1,
  IDENTIFY = 2,
  PRESENCE_UPDATE = 3,
  VOICE_STATE_UPDATE = 4,
  RESUME = 6,
  REQEUEST_GUILD_MEMBERS = 8,
}

export enum ServerOpcodes {
  DISPATCH = 0,
  HEARTBEAT = 1,
  RECONNECT = 7,
  INVALID_SESSION = 9,
  HELLO = 10,
  HEARTBEAT_ACK = 11,
}

export interface ClientPayload<Op extends ClientOpcodes, D> {
  op: Op;
  d: D;
}

export interface ServerPayload<Op extends ServerOpcodes, D> {
  op: Op;
  d: D;
}

export type HeartbeatClientPayload = ClientPayload<
  ClientOpcodes.HEARTBEAT,
  number
>;

export type IdentifyPayload = ClientPayload<
  ClientOpcodes.IDENTIFY,
  {
    token: string;
    properties: {
      $os: string;
      $browser: string;
      $device: string;
    };
    compress?: boolean;
    large_threshold?: number;
    shard?: [number, number];
    presence?: PresenceUpdate;
    intents: number;
  }
>;

export interface DispatchPayload<T extends DispatchEventName, D>
  extends ServerPayload<ServerOpcodes.DISPATCH, D> {
  t: T;
  s: number;
}

export enum DispatchEventName {
  HELLO = 'HELLO',
  READY = 'READY',
  RESUMED = 'RESUMED',
  RECONNECT = 'RECONNECT',
  INVALID_SESSION = 'INVALID_SESSION',
  APPLICATION_COMMAND_CREATE = 'APPLICATION_COMMAND_CREATE',
  APPLICATION_COMMAND_UPDATE = 'APPLICATION_COMMAND_UPDATE',
  APPLICATION_COMMAND_DELETE = 'APPLICATION_COMMAND_DELETE',
  CHANNEL_CREATE = 'CHANNEL_CREATE',
  CHANNEL_UPDATE = 'CHANNEL_UPDATE',
  CHANNEL_DELETE = 'CHANNEL_DELETE',
  CHANNEL_PINS_UPDATE = 'CHANNEL_PINS_UPDATE',
  THREAD_CREATE = 'THREAD_CREATE',
  THREAD_UPDATE = 'THREAD_UPDATE',
  THREAD_DELETE = 'THREAD_DELETE',
  THREAD_LIST_SYNC = 'THREAD_LIST_SYNC',
  THREAD_MEMBER_UPDATE = 'THREAD_MEMBER_UPDATE',
  THREAD_MEMBERS_UPDATE = 'THREAD_MEMBERS_UPDATE',
  GUILD_CREATE = 'GUILD_CREATE',
  GUILD_UPDATE = 'GUILD_UPDATE',
  GUILD_DELETE = 'GUILD_DELETE',
  GUILD_BAN_ADD = 'GUILD_BAN_ADD',
  GUILD_BAN_REMOVE = 'GUILD_BAN_REMOVE',
  GUILD_EMOJIS_UPDATE = 'GUILD_EMOJIS_UPDATE',
  GUILD_STICKERS_UPDATE = 'GUILD_STICKERS_UPDATE',
  GUILD_INTEGRATIONS_UPDATE = 'GUILD_INTEGRATIONS_UPDATE',
  GUILD_MEMBER_ADD = 'GUILD_MEMBER_ADD',
  GUILD_MEMBER_REMOVE = 'GUILD_MEMBER_REMOVE',
  GUILD_MEMBER_UPDATE = 'GUILD_MEMBER_UPDATE',
  GUILD_MEMBERS_CHUNK = 'GUILD_MEMBERS_CHUNK',
  GUILD_ROLE_CREATE = 'GUILD_ROLE_CREATE',
  GUILD_ROLE_UPDATE = 'GUILD_ROLE_UPDATE',
  GUILD_ROLE_DELETE = 'GUILD_ROLE_DELETE',
  INTEGRATION_CREATE = 'INTEGRATION_CREATE',
  INTEGRATION_UPDATE = 'INTEGRATION_UPDATE',
  INTEGRATION_DELETE = 'INTEGRATION_DELETE',
  INTERACTION_CREATE = 'INTERACTION_CREATE',
  INVITE_CREATE = 'INVITE_CREATE',
  INVITE_DELETE = 'INVITE_DELETE',
  MESSAGE_CREATE = 'MESSAGE_CREATE',
  MESSAGE_UPDATE = 'MESSAGE_UPDATE',
  MESSAGE_DELETE = 'MESSAGE_DELETE',
  MESSAGE_DELETE_BULK = 'MESSAGE_DELETE_BULK',
  MESSAGE_REACTION_ADD = 'MESSAGE_REACTION_ADD',
  MESSAGE_REACTION_REMOVE = 'MESSAGE_REACTION_REMOVE',
  MESSAGE_REACTION_REMOVE_ALL = 'MESSAGE_REACTION_REMOVE_ALL',
  MESSAGE_REACTION_REMOVE_EMOJI = 'MESSAGE_REACTION_REMOVE_EMOJI',
  PRESENCE_UPDATE = 'PRESENCE_UPDATE',
  STAGE_INSTANCE_CREATE = 'STAGE_INSTANCE_CREATE',
  STAGE_INSTANCE_DELETE = 'STAGE_INSTANCE_DELETE',
  STAGE_INSTANCE_UPDATE = 'STAGE_INSTANCE_UPDATE',
  TYPING_START = 'TYPING_START',
  USER_UPDATE = 'USER_UPDATE',
  VOICE_STATE_UPDATE = 'VOICE_STATE_UPDATE',
  VOICE_SERVER_UPDATE = 'VOICE_SERVER_UPDATE',
  WEBHOOKS_UPDATE = 'WEBHOOKS_UPDATE',
}

export interface User {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  locale?: string;
  verified?: boolean;
  email?: string | null;
  flags?: number; // TODO
  premium_type?: number; // TODO
  public_flags?: number;
}

export interface UnavailableGuild {
  id: string;
  unavailable: true;
}

export type ReadyDispatchPayload = DispatchPayload<
  DispatchEventName.READY,
  {
    v: GatewayVersionNumber;
    user: User;
    guilds: UnavailableGuild[];
    session_id: string;
    shard?: [number, number];
    application: {
      id: string;
      flags?: number;
    };
  }
>;

export enum PresenceActivityType {
  GAME = 0,
  STREAMING = 1,
  LISTENING = 2,
  WATCHING = 3,
  CUSTOM = 4,
  COMPETING = 5,
}

export interface PresenceActivityButton {
  label: string;
  url: string;
}

export interface PresenceActivity {
  name: string;
  type: PresenceActivityType;
  url?: string;
  created_at: number;
  timestamps?: {
    start?: number;
    end?: number;
  };
  application_id?: string;
  details?: string;
  state?: string;
  emoji?: {
    name: string;
    id?: string;
    animated?: boolean;
  };
  party?: {
    id?: string;
    size?: [number, number];
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
  secrets?: {
    join?: string;
    spectate?: string;
    match?: string;
  };
  instance?: boolean;
  flags?: number;
  buttons?: PresenceActivityButton[];
}

export type PresenceStatus =
  | 'online'
  | 'dnd'
  | 'idle'
  | 'invisible'
  | 'offline';

export interface PresenceUpdate {
  since?: number;
  activities: PresenceActivity[];
  status: PresenceStatus;
  afk: boolean;
}
