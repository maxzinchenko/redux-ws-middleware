export const PREFIX = 'use-socket';


export class LoggerService {
  readonly #prefix: string;

  constructor() {
    this.#prefix = PREFIX;
  }

  log = (message: string, data?: unknown) => {
    // eslint-disable-next-line no-console
    console.groupCollapsed(`[${this.#prefix}] ${message}`);
    // eslint-disable-next-line no-console
    data && console.log(data);
    // eslint-disable-next-line no-console
    console.groupEnd();
  }

  error = (message: string, data?: unknown) => {
    // eslint-disable-next-line no-console
    console.error(`[${this.#prefix}] ${message}`, data);
  }
}
