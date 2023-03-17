import { WebSocketService } from './WebSocketService';
import { Options } from './WebSocketService.types';

enum ActionType {
  CONNECTED = 'testConnected',
  DISCONNECTED = 'testDisconnected'
}

const log = jest.fn();
const error = jest.fn();

jest.mock('../Logger/LoggerService', () => ({
  LoggerService: jest.fn().mockImplementation(() => ({ log, error })),
}));

const messageHandler = jest.fn();
const shouldClose = jest.fn();
const shouldOpen = jest.fn();
const serialize = jest.fn();
const deserialize = jest.fn();
const dispatch = jest.fn();

const options: Options<unknown, unknown> = {
  url: 'ws://test.localhost:3000',
  onMessage: messageHandler,
  shouldClose,
  shouldOpen,
  serialize,
  deserialize,
  debug: true,
  autoConnect: true,
  shouldReconnect: true,
  reconnectionInterval: [0, 1000, 5000]
}

const actionTypes: [ActionType, ActionType] = [ActionType.CONNECTED, ActionType.DISCONNECTED];

const WS_ERROR = 'WebSocket is not connected. Make sure it is connected before triggering an action.';

describe('WebSocketService', () => {
  let webSocketService: WebSocketService<unknown, unknown>;

  const mockWebSocket: any = {}
  mockWebSocket.readyState = 1;

  beforeEach(() => {
    mockWebSocket.send = jest.fn();
    mockWebSocket.addEventListener = jest.fn();
    mockWebSocket.removeEventListener = jest.fn();
    mockWebSocket.close = jest.fn();

    // @ts-ignore
    window.WebSocket = jest.fn(() => mockWebSocket);

    webSocketService = new WebSocketService(options, dispatch, actionTypes);
  });

  describe('.open', () => {
    describe('WebSocket is not established yet', () => {
      it('should make a WebSocket instance with correct options', () => {
        expect(WebSocket).toBeCalledTimes(1);
        expect(WebSocket).toBeCalledWith(options.url, options.protocols);
      });

      it('should add listeners 4 listeners', () => {
        expect(mockWebSocket.addEventListener).toBeCalledTimes(4);
        expect(mockWebSocket.addEventListener).toBeCalledWith('open', expect.any(Function));
        expect(mockWebSocket.addEventListener).toBeCalledWith('message', expect.any(Function));
        expect(mockWebSocket.addEventListener).toBeCalledWith('error', expect.any(Function));
        expect(mockWebSocket.addEventListener).toBeCalledWith('close', expect.any(Function));
      });
    });

    describe('WebSocket is established already', () => {
      it('should not make any other WebSocket instance if the current one exists', () => {
        webSocketService.open();
        webSocketService.open();
        webSocketService.open();

        expect(WebSocket).toBeCalledTimes(1);
        expect(WebSocket).not.toBeCalledTimes(2);
        expect(WebSocket).not.toBeCalledTimes(3);
      });
    });
  });

  describe('.close', () => {
    describe('WebSocket.readyState is WebSocket.CLOSED (3)', () => {
      mockWebSocket.readyState = 3;

      it('should throw error', () => {
        expect(webSocketService.close).toThrowError(WS_ERROR);
      });
    });

    describe('WebSocket.readyState is WebSocket.CLOSING (2)', () => {
      mockWebSocket.readyState = 2;

      it('should throw error', () => {
        expect(webSocketService.close).toThrowError(WS_ERROR);
      });
    });

    describe('WebSocket.readyState is WebSocket.CONNECTING (0)', () => {
      mockWebSocket.readyState = 0;

      it('should throw error', () => {
        expect(webSocketService.close).toThrowError(WS_ERROR);
      });
    });

    // describe('WebSocket.readyState is WebSocket.OPEN (1)', () => {
    //   it('should not throw error', () => {
    //     expect(webSocketService.close).not.toThrowError(WS_ERROR);
    //   });
    //
    //   it('should remove listeners 4 listeners', () => {
    //     expect(mockWebSocket.removeEventListener).toBeCalledTimes(4);
    //     expect(mockWebSocket.removeEventListener).toBeCalledWith('open', expect.any(Function));
    //     expect(mockWebSocket.removeEventListener).toBeCalledWith('message', expect.any(Function));
    //     expect(mockWebSocket.removeEventListener).toBeCalledWith('error', expect.any(Function));
    //     expect(mockWebSocket.removeEventListener).toBeCalledWith('close', expect.any(Function));
    //   });
    // });
  });

  afterAll(() => {
    mockWebSocket.readyState = 1;
    jest.clearAllMocks();
  });
});
