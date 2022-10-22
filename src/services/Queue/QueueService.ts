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
    const uniqueRequest = this.#getUniqueRequest(data);
    if (!uniqueRequest) return;

    this.#queue.push(uniqueRequest);

    this.log('Added to queue', data);
  };

  remove = (data: Req) => {
    const stringifiedRequest = JSON.stringify(data);
    this.#queue = this.#queue.filter((value) => value !== stringifiedRequest);

    this.log('Removed from queue', data);
  };

  clear = () => {
    this.#queue = [];

    this.log('Queue cleared');
  };

  /*
   * Private
   */

  #getUniqueRequest = (data: Req) => {
    const stringifiedRequest = JSON.stringify(data);
    const exisitngRequest = this.#queue.includes(stringifiedRequest);
    if (exisitngRequest) {
      this.log('Already in queue', data);
      return null;
    }

    return stringifiedRequest;
  };
}
