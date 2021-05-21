import * as express from 'express';
import * as handlebars from 'handlebars';
import * as ExpressHandlebars from 'express-handlebars';
import {ArenaConfig} from '../interfaces';
import {ArenaQueue} from './queue';
import * as HandlebarsHelpers from './views/helpers/handlebars';
import routes from './views/dashboard';
import {join} from 'path';
import _ from 'lodash';

export class Arena {
  private readonly queues: ArenaQueue;
  private readonly app: express.Express;

  constructor(basePath: string = '', private readonly config: ArenaConfig) {
    this.queues = new ArenaQueue(config);

    const app = express();

    app.locals.Queues = this.queues;
    app.locals.appBasePath = basePath;
    app.locals.vendorPath = '/vendor';
    app.locals.customCssPath = config.customCssPath;
    app.locals.customJsPath = config.customJsPath;

    app.set('views', `${__dirname}/views`);
    app.set('view engine', 'hbs');
    app.set('json spaces', 2);

    for (const helper in HandlebarsHelpers) {
      handlebars.registerHelper(helper, HandlebarsHelpers[helper]);
    }
    handlebars.registerHelper('useCdn', () => {
      return this.config.useCdn;
    });

    app.use(basePath, express.static(join(__dirname, '..', 'public')));

    app.engine(
      'hbs',
      ExpressHandlebars.create({
        defaultLayout: `${__dirname}/views/layout`,
        handlebars,
        partialsDir: `${__dirname}/views/partials/`,
        extname: 'hbs',
      }).engine
    );

    app.use(basePath, routes);
    app.use(express.json());

    this.app = app;
  }

  getApp() {
    return this.app;
  }

  getQueues() {
    return this.queues;
  }
}
