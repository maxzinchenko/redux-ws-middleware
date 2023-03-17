import { BaseService } from '../BaseService';

export class ReconnectService extends BaseService {
  private readonly interval: number | number[];
  private readonly callback: () => void;

  private reconnections = 0;
  private timeout: NodeJS.Timeout | null = null;

  constructor(callback: () => void, interval: number | number[] = 1000, debug?: boolean) {
    super({ debug });

    this.interval = interval;
    this.callback = callback;
  }

  startJob = () => {
    const interval = this.getInterval();

    this.log(`Reconnect in ${interval}ms`);

    this.timeout = setTimeout(this.callback, interval);
    this.incrementReconnections();
  };

  removeJob = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    this.resetReconnections();
  };

  /*
   * Private
   */

  private getInterval = (interval = this.interval) => {
    if (typeof interval === 'number') return interval;
    if (!interval.length) return 0;

    const lastIntervalsIdx = interval.length - 1;

    if (this.reconnections <= lastIntervalsIdx) {
      return interval[this.reconnections];
    }

    return interval[lastIntervalsIdx];
  };

  private setReconnections = (value: number) => {
    this.reconnections = value;
  };

  private incrementReconnections = (start = this.reconnections) => {
    this.setReconnections(start + 1);
  };

  private resetReconnections = () => {
    this.setReconnections(0);
  };
}
