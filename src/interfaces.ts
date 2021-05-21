import Bull from 'bull';
import {Queue} from 'bullmq';
import * as Bee from 'bee-queue';
import {RedisOptions, Redis} from 'ioredis';
import {ClientOpts} from 'redis';
import {QUEUE_TYPES} from './enums';

export interface ArenaConfig {
  /**
   * Bee queue constructor
   */
  Bee?: typeof Bee;
  /**
   * Bull queue constructor
   */
  Bull?: typeof Bull;
  /**
   * BullMQ queue constructor
   */
  BullMQ?: typeof Queue;
  /**
   * Queue configuration
   */
  queues: QueueConfig[];
  /**
   * Path to custom css
   */
  customCssPath?: string;
  /**
   * Path to custom js
   */
  customJsPath?: string;
  /**
   * Use CDN for third party libraries
   */
  useCdn?: boolean;
}

export interface ListenerConfig {
  /**
   * Base path of arena to listen on
   */
  basePath: string;
  /**
   * Disable http listener
   */
  disableListen: boolean;
  /**
   * Port to listen on
   */
  port: number;
  /**
   * Host to listen on
   */
  host?: string;
}

export interface QueueAdapter {
  parseJob(job: any): JobAdapter;
  createJob(data?: {}, jobName?: string): Promise<JobAdapter>;
  getName(): string;
  getQueue():
    | InstanceType<ArenaConfig['Bee']>
    | InstanceType<ArenaConfig['BullMQ']>
    | InstanceType<ArenaConfig['Bull']>;
  getQueueConfig(): QueueConfig;
}

export interface JobAdapter {
  /**
   * Get job timestamp as epoch
   */
  getTimestamp(): number;
  /**
   * Get job delay in ms
   */
  getDelay(): number;
  /**
   * Get job id
   */
  getId(): string | number;
  /**
   * Get job name
   */
  getName(): string | void;
  /**
   * Get raw job object
   */
  getRawJob(): any;
}

export interface QueueConfig {
  /**
   * Queue name
   */
  name: string;
  /**
   * User readable display name for the host
   */
  hostId: string;
  /**
   * Queue type
   */
  type: QUEUE_TYPES;
  /**
   * Queue key prefix
   */
  prefix?: string;
  /**
   * Redis configuration
   */
  redis?: ClientOpts & RedisOptions & RedisConfig;
  /**
   * Bull specific: factory function to return redis instance
   * @url https://github.com/OptimalBits/bull/blob/master/PATTERNS.md#reusing-redis-connections
   */
  createClient?(type: string): Redis;
}

interface RedisConfig {
  /**
   * Redis hostname
   */
  host: string;
  /**
   * Redis port
   */
  port: number;
  /**
   * Redis password
   */
  password?: string;
  /**
   * Database. You'll leave this empty most of the time
   */
  db?: number;
  /**
   * Redis url: [redis:]//[[user][:password@]][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]]
   */
  url?: string;
}
