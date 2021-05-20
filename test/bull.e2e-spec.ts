import * as express from 'express';
import {createServer, Server} from 'http';
import * as Arena from '../src';
import * as Bull from 'Bull';
import * as request from 'supertest';

describe('Bull Queue', () => {
  let server: Server;
  let app: express.Express;

  beforeEach(async () => {
    app = Arena(
      {
        Bull,
        queues: [
          {
            name: 'bull_queue',
            hostId: 'host_1',
            type: 'bull',
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
    expect(res.text).toContain('bull_queue');
  });
});
