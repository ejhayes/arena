import {QUEUE_TYPES} from '../../enums';
import {ArenaConfig, QueueConfig, QueueAdapter} from '../../interfaces';
import {BeeQueueAdapter} from './adapters/bee.adapter';
import {BullQueueAdapter} from './adapters/bull.adapter';
import {BullMQQueueAdapter} from './adapters/bullmq.adapter';

export class ArenaQueue {
  private readonly _queues: {[queueName: string]: QueueAdapter} = {};

  constructor(private readonly arenaConfig: ArenaConfig) {
    for (const queue of this.arenaConfig.queues) {
      console.log(`adding: ${queue.name}`);
      this.add(queue.name, queue);
    }
  }

  list() {
    return Object.values(this._queues).map((i) => i.getQueueConfig());
  }

  createJob(queueName: string, data?: {}, jobName?: string) {
    return this.get(queueName).createJob(data, jobName);
  }

  get(queueName: string) {
    return this._queues[queueName];
  }

  add(queueName: string, queue: QueueConfig) {
    switch (queue.type) {
      case QUEUE_TYPES.BEE:
        this._queues[queueName] = new BeeQueueAdapter(
          this.arenaConfig.Bee,
          queue
        );
        break;
      case QUEUE_TYPES.BULL:
        this._queues[queueName] = new BullQueueAdapter(
          this.arenaConfig.Bull,
          queue
        );
        break;
      case QUEUE_TYPES.BULLMQ:
        this._queues[queueName] = new BullMQQueueAdapter(
          this.arenaConfig.BullMQ,
          queue
        );
        break;
      default:
        throw new Error(`Unknown queue type: ${queue.type}`);
    }
  }

  remove(queueName: string) {
    if (queueName in this._queues) {
      delete this._queues[queueName];
    }
  }
}
