import { LoggerService } from '../services/Logger/LoggerService';

import { BaseOptions } from './BaseServiceTypes';

export class BaseService {
  readonly #loggerService?: LoggerService;

  constructor({ debug }: BaseOptions) {
    if (!debug) return;

    this.#loggerService = new LoggerService();
  }

  log = <D>(message: string, data?: D) => {
    this.#loggerService?.log(message, data);
  };

  error = <D>(message: string, data?: D) => {
    this.#loggerService?.error(message, data);
  };
}
