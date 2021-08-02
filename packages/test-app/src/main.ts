import { startGateway } from '@cobalt/gateway';

async function main() {
  await startGateway({
    botToken: process.env.TOKEN ?? '',
    shardsPerCluster: 3,
    shardsCount: 15,
  });
}

main();
