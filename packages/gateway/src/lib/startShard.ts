import * as WebSocket from 'ws';
import { logger } from '../logger';
import {
  CobaltGatewayState,
  CobaltShard,
  GatewayConnectionConfig,
} from './types';
import { createUnzip } from 'zlib';
import { handleShardMessage } from './handleShardMessage';

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

export async function startShard(
  shard: CobaltShard,
  state: CobaltGatewayState
) {
  const unzip = createUnzip();

  unzip.on('data', (ddd) => {
    // TODO: better parsing
    handleShardMessage(shard, JSON.parse(ddd.toString('utf8')));
  });

  shard.ws = createSocket(state.connection);

  shard.ws.onopen = () => {
    logger.log('debug', 'Opened WS connection for shard %d', shard.id);
  };

  shard.ws.onmessage = (message) => {
    if (state.connection.compress === 'zlib-stream') {
      unzip.write(message.data);
    } else {
      // TODO: better parsing
      handleShardMessage(shard, JSON.parse(message.data as string));
    }
  };
}
