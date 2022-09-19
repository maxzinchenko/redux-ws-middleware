import { BaseService } from '../BaseService';

export class QueueService<Req> extends BaseService {
  readonly #queue = new Set<Req>([]);

  constructor(debug?: boolean) {
    super({ debug });
  }

  getValues = () => {
    return [...this.#queue.values()];
  };

  add = (data: Req) => {
    this.#queue.add(data);

    this.log('Added to queue', data);
  };

  remove = (data: Req) => {
    this.#queue.delete(data);

    this.log('Removed from queue', data);
  };

  clear = () => {
    this.#queue.clear();

    this.log('Queue cleared');
  };
}
