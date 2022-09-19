import { BaseService } from '../BaseService';

export class ReconnectService extends BaseService {
  readonly #interval: number | number[];
  readonly #callback: () => void;

  #reconnections = 0;
  #timeout: NodeJS.Timeout | null = null;

  constructor(callback: () => void, interval: number | number[] = 1000, debug?: boolean) {
    super({ debug });

    this.#interval = interval;
    this.#callback = callback;
  }

  startJob = () => {
    const interval = this.#getInterval();

    this.log(`Reconnect in ${interval}ms`);

    this.#timeout = setTimeout(this.#callback, interval);
    this.#incrementReconnections();
  };

  removeJob = () => {
    if (this.#timeout) {
      clearTimeout(this.#timeout);
      this.#timeout = null;
    }

    this.#resetReconnections();
  };

  /*
   * Private
   */

  #getInterval = (interval = this.#interval) => {
    if (typeof interval === 'number') return interval;
    if (!interval.length) return 0;

    const lastIntervalsIdx = interval.length - 1;

    if (this.#reconnections <= lastIntervalsIdx) {
      return interval[this.#reconnections];
    }

    return interval[lastIntervalsIdx];
  };

  #setReconnections = (value: number) => {
    this.#reconnections = value;
  };

  #incrementReconnections = (start = this.#reconnections) => {
    this.#setReconnections(start + 1);
  };

  #resetReconnections = () => {
    this.#setReconnections(0);
  };
}
