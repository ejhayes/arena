import * as express from 'express';
import * as path from 'path';
import * as Arena from '../src';
import * as Bull from 'bull';
import * as RedisServer from 'redis-server';
import {QUEUE_TYPES} from '../src/enums';

// Select ports that are unlikely to be used by other services a developer might be running locally.
const HTTP_SERVER_PORT = 4735;
const REDIS_SERVER_PORT = 4736;

// Create a Redis server. This is only for convenience

async function main() {
  const server = new RedisServer(REDIS_SERVER_PORT);
  await server.open();

  const queue = new Bull('name_of_my_queue', {
    redis: {
      port: REDIS_SERVER_PORT,
    },
  });

  // Fake process function to move newly created jobs in the UI through a few of the job states.
  queue.process(async function () {
    // Wait 5sec
    await new Promise((res) => setTimeout(res, 5000));

    // Randomly succeeds or fails the job to put some jobs in completed and some in failed.
    if (Math.random() > 0.5) {
      throw new Error('fake error');
    }
  });

  // adding delayed jobs
  const delayedJob = await queue.add({}, {delay: 60 * 1000});
  delayedJob.log('Log message');

  const app = Arena(
    {
      Bull,

      queues: [
        {
          // Required for each queue definition.
          name: 'name_of_my_queue',

          // User-readable display name for the host. Required.
          hostId: 'Queue Server 1',

          // Queue type (Bull or Bee - default Bull).
          type: QUEUE_TYPES.BULL,

          redis: {
            host: '127.0.0.1',
            port: REDIS_SERVER_PORT,
          },
        },
      ],
      customJsPath: 'http://localhost:4735/example.js',
    },
    {
      port: HTTP_SERVER_PORT,
    }
  );

  app.use(express.static(path.join(__dirname, 'public')));
  return app;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
