import { LoggerService } from './LoggerService';

describe('LoggerService', () => {
  const loggerService = new LoggerService();

  beforeAll(() => {
    console.log = jest.fn();
    console.groupCollapsed = jest.fn();
    console.groupEnd = jest.fn();
    console.error = jest.fn();
  });

  describe('.log', () => {
    const data = { test: 'test' };

    it('should show group log in console with data', () => {
      loggerService.log('some message', data);

      expect(console.groupCollapsed).toBeCalled();
      expect(console.log).toBeCalledWith(data);
      expect(console.groupEnd).toBeCalled();
    });
  });

  describe('.error', () => {
    const message = 'some message 2';
    const data = { test: 'test2' };

    it('should show error in console with data', () => {
      loggerService.error(message, data);
      expect(console.error).toBeCalled();
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
