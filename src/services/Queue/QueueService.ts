import { BaseService } from '../BaseService';

export class QueueService<Req> extends BaseService {
  #queue: string[] = [];

  constructor(debug?: boolean) {
    super({ debug });
  }

  getValues = (): Req[] => {
    return this.#queue.map((value) => JSON.parse(value));
  };

  add = (data: Req) => {
    this.#queue.push(JSON.stringify(data));

    this.log('Added to queue', data);
  };

  remove = (data: Req) => {
    this.#queue.filter(value => JSON.stringify(data) === value);

    this.log('Removed from queue', data);
  };

  clear = () => {
    this.#queue = [];

    this.log('Queue cleared');
  };
}
