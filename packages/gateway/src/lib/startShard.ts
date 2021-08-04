import * as WebSocket from 'ws';
import { logger } from '../logger';
import {
  CobaltGatewayState,
  CobaltShard,
  GatewayConnectionConfig,
} from './types';
import { createUnzip } from 'zlib';
import { handleShardMessage } from './handleShardMessage';
import { sendShardMessage } from './sendShardMessage';
import { identify } from './events';

function createSocket(config: GatewayConnectionConfig) {
  const params = new URLSearchParams();
  params.append('v', config.version);
  params.append('encoding', config.encoding);
  if (config.compress) {
    params.append('compress', config.compress);
  }

  const socket = new WebSocket(`${config.url}/?${params.toString()}`);
  socket.binaryType = 'nodebuffer';
  return socket;
}

export function startShard(shard: CobaltShard, state: CobaltGatewayState) {
  const unzip = createUnzip();

  unzip.on('data', (data) => {
    const unparsedPayload = JSON.parse(data.toString('utf8'));
    handleShardMessage(shard, state, unparsedPayload);
  });

  shard.ws = createSocket(state.connection);

  shard.ws.onopen = () => {
    logger.log('debug', 'Opened WS connection for shard %d', shard.id);

    sendShardMessage(shard, identify(state.botToken, state.intentsBit));
  };

  shard.ws.onmessage = ({ data }) => {
    if (
      typeof data !== 'string' ||
      state.connection.compress === 'zlib-stream'
    ) {
      unzip.write(data);
    } else {
      const unparsedPayload = JSON.parse(data);
      handleShardMessage(shard, state, unparsedPayload);
    }
  };
}
