import { LoggerService } from './LoggerService';

describe('LoggerService', () => {
  const loggerService = new LoggerService();

  console.log = jest.fn();
  console.groupCollapsed = jest.fn();
  console.groupEnd = jest.fn();
  console.error = jest.fn();

  describe('.log', () => {
    const data = { test: 'test' };
    loggerService.log('some message', data);

    it('should show group log in console with data', () => {
      expect(console.groupCollapsed).toBeCalled();
      expect(console.log).toBeCalledWith(data);
      expect(console.groupEnd).toBeCalled();
    });
  });

  describe('.error', () => {
    const message = 'some message 2';
    const data = { test: 'test2' };
    loggerService.error(message, data);

    it('should show error in console with data', () => {
      expect(console.error).toBeCalled();
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
