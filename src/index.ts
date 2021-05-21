import 'source-map-support/register';
import * as express from 'express';
import {Arena} from './server/app';
import {ArenaConfig, ListenerConfig} from './interfaces';
import {bool, cleanEnv, port, str} from 'envalid';
import {Server} from 'http';

class ArenaServer {
  private readonly _listenerConfig: ListenerConfig;
  private readonly _arena: Arena;
  private _server: Server;

  constructor(config: ArenaConfig, listenerConfig?: Partial<ListenerConfig>) {
    this._listenerConfig = cleanEnv(listenerConfig, {
      basePath: str({default: '/'}),
      disableListen: bool({default: false}),
      host: str({default: '0.0.0.0'}),
      port: port({default: 4735}),
    });

    if (!config.Bee && !config.Bull && !config.BullMQ) {
      throw new TypeError(
        'As of 3.0.0, bull-arena requires that the queue constructors be provided to Arena (Bull, Bee, BullMQ)'
      );
    }

    this._arena = new Arena(
      listenerConfig.basePath,
      Object.assign({useCdn: false}, config)
    );
  }

  getQueues() {
    return this._arena.getQueues();
  }

  start() {
    this._server = this._arena
      .getApp()
      .listen(this._listenerConfig.port, this._listenerConfig.host, () => {
        console.log(
          `Arena is listening on ${this._listenerConfig.host}:${this._listenerConfig.port}`
        );
      });
    return this._arena.getApp();
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._server.close((err?: Error) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }
}

const run = (
  config: ArenaConfig,
  listenerConfig: Partial<ListenerConfig> = {}
) => {
  return new ArenaServer(config, listenerConfig);
};
const runDefault = (
  config: ArenaConfig,
  listenerConfig: Partial<ListenerConfig> = {}
) => {
  return run(config, listenerConfig).start();
};

// ensure that default export remains the same while also
// providing access to the underlying run function
export = runDefault;
runDefault.run = run;
