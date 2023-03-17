import { BaseService } from '../BaseService';

export class QueueService<Req> extends BaseService {
  private queue: string[] = [];

  constructor(debug?: boolean) {
    super({ debug });
  }

  getValues = (): Req[] => {
    return this.queue.map((value) => JSON.parse(value));
  };

  add = (data: Req) => {
    const uniqueRequest = this.getUniqueRequest(data);
    if (!uniqueRequest) return;

    this.queue.push(uniqueRequest);

    this.log('Added to queue', data);
  };

  remove = (data: Req) => {
    const stringifyRequest = JSON.stringify(data);
    this.queue = this.queue.filter((value) => value !== stringifyRequest);

    this.log('Removed from queue', data);
  };

  clear = () => {
    this.queue = [];

    this.log('Queue cleared');
  };

  /*
   * Private
   */

  private getUniqueRequest = (data: Req) => {
    const stringifyRequest = JSON.stringify(data);
    const existingRequest = this.queue.includes(stringifyRequest);
    if (existingRequest) {
      this.log('Already in queue', data);
      return null;
    }

    return stringifyRequest;
  };
}
