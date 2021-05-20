import 'source-map-support/register';
import * as express from 'express';
import * as path from 'path';
import {run as Arena} from './server/app';
import {router as routes} from './server/views/routes';

function run(
  config,
  listenOpts: {
    useCdn?: boolean;
    basePath?: string;
    port?: number;
    host?: string;
    disableListen?: boolean;
  } = {}
) {
  const {app, Queues} = Arena(config);

  Queues.useCdn =
    typeof listenOpts.useCdn !== 'undefined' ? listenOpts.useCdn : true;

  app.locals.appBasePath = listenOpts.basePath || app.locals.appBasePath;

  app.use(
    app.locals.appBasePath,
    express.static(path.join(__dirname, 'public'))
  );
  app.use(app.locals.appBasePath, routes);

  const port = listenOpts.port || 4567;
  const host = listenOpts.host || '0.0.0.0'; // Default: listen to all network interfaces.
  if (!listenOpts.disableListen) {
    app.listen(port, host, () => {
      console.log(`Arena is running on port ${port} at host ${host}`);
    });
  }

  return {
    app,
    queues: Queues,
  };
}

function runDefault(config, listenOpts = {}) {
  return run(config, listenOpts).app;
}

// ensure that default export remains the same while also
// providing access to the underlying run function
export = runDefault;
runDefault.run = run;
