import {
  ArenaConfig,
  JobAdapter,
  QueueAdapter,
  QueueConfig,
} from '../../../interfaces';
import {Job} from 'bee-queue';

export class BeeJobAdapter implements JobAdapter {
  constructor(private readonly job: Job<unknown>) {}

  getDelay() {
    return this.job.options.delay;
  }
  getTimestamp() {
    return this.job.options.timestamp;
  }
  getId() {
    return this.job.id;
  }
  getName() {
    return '';
  }
  getRawJob() {
    return this.job;
  }
}

export class BeeQueueAdapter implements QueueAdapter {
  private readonly _queue: InstanceType<ArenaConfig['Bee']>;

  constructor(
    queueConstructor: ArenaConfig['Bee'],
    private readonly queueConfig: QueueConfig
  ) {
    this._queue = new queueConstructor(
      queueConfig.name,
      Object.assign(
        {
          isWorker: false,
          getEvents: false,
          sendEvents: false,
          storeJobs: false,
        },
        queueConfig.redis
      )
    );
  }

  async createJob(data?: {}, name?: string) {
    return new BeeJobAdapter(await this._queue.createJob(data).save());
  }

  parseJob(job: ReturnType<InstanceType<ArenaConfig['Bee']>['createJob']>) {
    return new BeeJobAdapter(job);
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
