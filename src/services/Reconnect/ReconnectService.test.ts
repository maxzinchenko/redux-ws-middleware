import { ReconnectService } from './ReconnectService';

describe('ReconnectService', () => {
  let reconnectService: ReconnectService;

  let connectCallback: jest.Mock;

  const intervals = [0, 1000, 5000];
  
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(window, 'setTimeout');
    jest.spyOn(window, 'clearTimeout');

    connectCallback = jest.fn();
    reconnectService = new ReconnectService(connectCallback, intervals);
  });

  describe('.startJob', () => {  
    const intervalsLength = intervals.length;
    const lastIntervalIdx = intervalsLength - 1;
    
    it('should call callback and use correct interval', () => {
      const testLaps = intervalsLength + 5;

      for (let i = 0; i < testLaps; i++) {
        const lap = i + 1;
        const intervalIdx = i > lastIntervalIdx ? lastIntervalIdx : i;

        reconnectService.startJob();

        expect(setTimeout).toBeCalledTimes(lap);
        expect(setTimeout).toBeCalledWith(connectCallback, intervals[intervalIdx]);

        jest.advanceTimersByTime(intervals[intervalIdx]);

        expect(connectCallback).toBeCalledTimes(lap);
        expect(connectCallback).toBeCalledWith();
      }
    });
  });

  describe('.removeJob', () => {  
    it('should clear pending timeot', () => {
      reconnectService.startJob();
      expect(setTimeout).toBeCalledTimes(1);
      
      reconnectService.removeJob();
      expect(clearTimeout).toBeCalledTimes(1);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
  });
});
