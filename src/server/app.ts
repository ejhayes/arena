import * as express from 'express';
import * as handlebars from 'handlebars';
import * as exphbs from 'express-handlebars';

export function run(config) {
  const hbs = exphbs.create({
    defaultLayout: `${__dirname}/views/layout`,
    handlebars,
    partialsDir: `${__dirname}/views/partials/`,
    extname: 'hbs',
  });

  const app = express();

  const defaultConfig = require('./config/index.json');

  const Queues = require('./queue');

  const queues = new Queues({...defaultConfig, ...config});
  require('./views/helpers/handlebars')(handlebars, {queues});
  app.locals.Queues = queues;
  app.locals.appBasePath = '';
  app.locals.vendorPath = '/vendor';
  app.locals.customCssPath = config.customCssPath;
  app.locals.customJsPath = config.customJsPath;

  app.set('views', `${__dirname}/views`);
  app.set('view engine', 'hbs');
  app.set('json spaces', 2);

  app.engine('hbs', hbs.engine);

  app.use(express.json());

  return {
    app,
    Queues: queues,
  };
}
