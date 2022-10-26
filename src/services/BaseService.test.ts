import { BaseService } from './BaseService';

const log = jest.fn();
const error = jest.fn();

jest.mock('./Logger/LoggerService', () => ({
  LoggerService: jest.fn().mockImplementation(() => ({ log, error })),
}));

describe('BaseService', () => {
  let baseService: BaseService;

  beforeAll(() => {
    baseService = new BaseService({ debug: true });
  });

  describe('.log', () => {
    const message = 'test log';
    const payload = { test: 'test', nested: { test: true } };

    it('should call the log method of the loggerService instance', () => {
      baseService.log(message, payload);

      expect(log).toBeCalledTimes(1);
      expect(log).toBeCalledWith(message, payload);
    });
  });

  describe('.error', () => {
    const message = 'test error';
    const payload = { test: 'test', nested: { test: true } };

    it('should call the error method of the loggerService instance', () => {
      baseService.error(message, payload);

      expect(error).toBeCalledTimes(1);
      expect(error).toBeCalledWith(message, payload);
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
