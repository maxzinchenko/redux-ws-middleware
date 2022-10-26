const PREFIX = 'redux-ws-middleware';

export class LoggerService {
  readonly #prefix = PREFIX;

  log = <D>(message: string, data?: D) => {
    console.groupCollapsed(`[${this.#prefix}] ${message}`);
    if (data) {
      console.log(data);
    }
    console.groupEnd();
  };

  error = <D>(message: string, data?: D) => {
    console.error(`[${this.#prefix}] ${message}`, data);
  };
}
