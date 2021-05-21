import * as crypto from 'crypto';
import * as _ from 'lodash';
import * as Handlebars from 'handlebars';
import * as moment from 'moment';
import {JobAdapter} from '../../../interfaces';

// For jobs that don't have a valid ID, produce a random ID we can use in its place.
const idMapping = new WeakMap();
const _blocks: {[blockName: string]: string[]} = {};

const helpers = {
  replacer: (key: string, value) => {
    if (_.isObject(value)) {
      return _.transform(value, (result, v, k) => {
        result[Handlebars.Utils.escapeExpression(k)] = v;
      });
    } else if (_.isString(value)) {
      return Handlebars.Utils.escapeExpression(value);
    } else {
      return value;
    }
  },

  json: (obj: any, pretty: boolean = false) => {
    return new Handlebars.SafeString(
      JSON.stringify(obj, null, pretty ? 2 : undefined)
    );
  },

  isNumber: (value: any) => {
    return _.isNumber(value);
  },

  adjustedPage: (
    currentPage: number,
    pageSize: number,
    newPageSize: number
  ) => {
    const firstId = (currentPage - 1) * pageSize;
    return _.ceil(firstId / newPageSize) + 1;
  },

  block: (name: string) => {
    if (name in _blocks) {
      return _blocks[name].join('\n');
    }
  },

  contentFor: (name: string, options: {fn: Function}) => {
    if (!(name in _blocks)) {
      _blocks[name] = [];
    }

    _blocks[name].push(options.fn(this));
  },

  hashIdAttr: (obj: {id: any}) => {
    if (typeof obj.id === 'string') {
      return crypto.createHash('sha256').update(obj.id).digest('hex');
    }

    let mapping = idMapping.get(obj);
    if (!mapping) {
      mapping = crypto.randomBytes(32).toString('hex');
      idMapping.set(obj, mapping);
    }
    return mapping;
  },

  getDelayedExecutionAt: (job: JobAdapter) => {
    return job.getDelay() + job.getTimestamp();
  },

  getTimestamp: (job: JobAdapter) => {
    return job.getTimestamp();
  },

  encodeURI: (url: string) => {
    if (typeof url !== 'string') {
      return '';
    }

    return encodeURIComponent(url);
  },

  capitalize: (value: string) => {
    return _.capitalize(value);
  },

  add: (a: any, b: any) => {
    if (helpers.isNumber(a) && helpers.isNumber(b)) {
      return parseInt(a, 10) + parseInt(b, 10);
    }
    if (typeof a === 'string' && typeof b === 'string') {
      return a + b;
    }

    return '';
  },

  subtract: (a, b) => {
    if (!Handlebars.helpers.isNumber(a)) {
      throw new TypeError('expected the first argument to be a number');
    }
    if (!Handlebars.helpers.isNumber(b)) {
      throw new TypeError('expected the second argument to be a number');
    }
    return parseInt(a, 10) - parseInt(b, 10);
  },

  length: (value) => {
    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length;
    }
    return 0;
  },

  moment: (date, format) => {
    return moment(date).format(format);
  },

  eq: (a, b, options: {fn: Function; inverse: Function}) => {
    return a === b ? options.fn(this) : options.inverse(this);
  },
};

export = helpers;
