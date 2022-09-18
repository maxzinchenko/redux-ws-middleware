import { BaseService } from '~/services/BaseService';

export class QueueService<Req> extends BaseService {
  constructor(debug?: boolean) {
    super({ debug });
  }

  readonly #queue = new Set<Req>();

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
