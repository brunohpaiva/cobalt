import { logger } from '../logger';
import { heartbeat } from './events';
import { sendShardMessage } from './sendShardMessage';
import {
  CobaltGatewayState,
  CobaltShard,
  DispatchEventName,
  DispatchPayload,
  ServerOpcodes,
  ServerPayload,
} from './types';

function handleDispatchEvent<T extends DispatchEventName, D>(
  payload: DispatchPayload<T, D>
) {
  switch (payload.t) {
    case DispatchEventName.READY: {
      console.log('ready');
      break;
    }
    default:
      break;
  }
}

export function handleShardMessage<Op extends ServerOpcodes, D>(
  shard: CobaltShard,
  state: CobaltGatewayState,
  payload: ServerPayload<Op, D>
) {
  logger.log('debug', 'Received message for shard %d: %o', shard.id, payload);

  switch (payload.op) {
    case ServerOpcodes.HELLO: {
      // TODO: starts sending heartbeats
      sendShardMessage(shard, heartbeat(null));
      break;
    }
    case ServerOpcodes.DISPATCH: {
      handleDispatchEvent(payload as unknown as never);
      break;
    }
    default:
      break;
  }
}
