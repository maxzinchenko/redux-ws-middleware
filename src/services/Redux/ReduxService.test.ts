import { ReduxService } from './ReduxService';

enum Type {
  CONNECTED = 'connected_test',
  DISCONNECTED = 'disconnected_test'
}

describe('ReduxService', () => {
  let reduxService: ReduxService;
  
  let dispatch: jest.Mock;
  
  beforeAll(() => {
    dispatch = jest.fn();
    reduxService = new ReduxService([Type.CONNECTED, Type.DISCONNECTED], dispatch);
  });

  describe('.getDispatch', () => {  
    it('should return dispatch function', () => {
      expect(reduxService.getDispatch()).toEqual(dispatch);
    });
  });

  describe('.dispatchConnected', () => {  
    it('should call dispatch with correct action type', () => {
      reduxService.dispatchConnected();

      expect(dispatch).toBeCalledTimes(1);
      expect(dispatch).toBeCalledWith({ type: Type.CONNECTED });
    });
  });

  describe('.dispatchDisconnected', () => {  
    const payload = { someText: 'text', nested: { key: 'test' } };

    it('should call dispatch with correct action type', () => {
      reduxService.dispatchDisconnected();

      expect(dispatch).toBeCalledWith({ type: Type.DISCONNECTED });
    });

    it('should call dispatch with correct action type and additional data from received payload', () => {
      reduxService.dispatchDisconnected(payload);

      expect(dispatch).toBeCalledWith({ type: Type.DISCONNECTED, payload });
    });
  });

  afterAll(() => {
    jest.resetAllMocks();
  });
});
