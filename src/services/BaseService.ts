import { LoggerService } from './Logger/LoggerService';
import { BaseOptions } from './BaseService.types';

export class BaseService {
  private readonly loggerService?: LoggerService;

  constructor({ debug }: BaseOptions) {
    if (!debug) return;

    this.loggerService = new LoggerService();
  }

  log = <D>(message: string, data?: D) => {
    this.loggerService?.log(message, data);
  };

  error = <D>(message: string, data?: D) => {
    this.loggerService?.error(message, data);
  };
}
