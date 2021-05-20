import * as express from 'express';
import {createServer, Server} from 'http';
import * as Arena from '../src';
import {Queue, QueueScheduler, Worker, FlowProducer} from 'bullmq';
import * as request from 'supertest';

describe('BullMQ Queue', () => {
  let server: Server;
  let app: express.Express;

  beforeEach(async () => {
    app = Arena(
      {
        BullMQ: Queue,
        queues: [
          {
            // Required for each queue definition.
            name: 'bullmq_queue',

            // User-readable display name for the host. Required.
            hostId: 'Queue Server 1',

            // Queue type (Bull or Bullmq or Bee - default Bull).
            type: 'bullmq',
          },
        ],
      },
      {disableListen: true}
    );
    server = createServer(app);
  });

  afterEach(() => {
    server.close();
  });

  it('/works', async () => {
    const res = await request(server.listen()).get('/');

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('bullmq_queue');
  });
});
