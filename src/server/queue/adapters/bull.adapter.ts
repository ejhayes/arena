import {
  ArenaConfig,
  JobAdapter,
  QueueAdapter,
  QueueConfig,
} from '../../../interfaces';
import {Job} from 'bull';

export class BullJobAdapter implements JobAdapter {
  constructor(private readonly job: Job) {}

  getDelay() {
    return this.job.opts.delay;
  }
  getTimestamp() {
    return this.job.timestamp;
  }
  getId() {
    return this.job.id;
  }
  getName() {
    return this.job.name;
  }
  getRawJob() {
    return this.job;
  }
}

export class BullQueueAdapter implements QueueAdapter {
  private readonly _queue: InstanceType<ArenaConfig['Bull']>;

  constructor(
    queueConstructor: ArenaConfig['Bull'],
    private readonly queueConfig: QueueConfig
  ) {
    this._queue = new queueConstructor(queueConfig.name, {
      ...(queueConfig.createClient
        ? {createClient: queueConfig.createClient}
        : {}),
      ...queueConfig.redis,
    });
  }

  async createJob(data?: {}, name?: string) {
    return new BullJobAdapter(
      await this._queue.add(name, data, {
        removeOnComplete: false,
        removeOnFail: false,
      })
    );
  }

  parseJob(job: Job) {
    return new BullJobAdapter(job);
  }

  getQueue() {
    return this._queue;
  }

  getName(): string {
    return this._queue.name;
  }

  getQueueConfig() {
    return this.queueConfig;
  }
}
