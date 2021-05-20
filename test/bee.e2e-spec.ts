import * as express from 'express';
import {createServer, Server} from 'http';
import * as Arena from '../src';
import * as Bee from 'bee-queue';
import * as request from 'supertest';

describe('Bee Queue', () => {
  let server: Server;
  let app: express.Express;

  beforeEach(async () => {
    app = Arena(
      {
        Bee,
        queues: [
          {
            // Required for each queue definition.
            name: 'bee_queue',

            // User-readable display name for the host. Required.
            hostId: 'Queue Server 1',

            // Queue type (Bull or Bee - default Bull).
            type: 'bee',
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

  it('shows a bee queue', async () => {
    const res = await request(server.listen()).get('/');

    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('bee_queue');
  });
});
