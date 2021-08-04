import * as os from 'os';
import {
  ClientOpcodes,
  HeartbeatClientPayload,
  IdentifyPayload,
  PresenceUpdate,
} from './types';

export function heartbeat(lastSequence: number | null): HeartbeatClientPayload {
  return {
    op: ClientOpcodes.HEARTBEAT,
    d: lastSequence,
  };
}

export function identify(
  token: string,
  intents: number,
  compress?: boolean,
  large_threshold?: number,
  shard?: [number, number],
  presence?: PresenceUpdate
): IdentifyPayload {
  return {
    op: ClientOpcodes.IDENTIFY,
    d: {
      token,
      properties: {
        $os: os.platform(),
        $browser: 'Cobalt',
        $device: 'Cobalt',
      },
      compress,
      large_threshold,
      shard,
      presence,
      intents,
    },
  };
}
