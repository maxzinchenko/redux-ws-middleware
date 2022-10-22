import { QueueService } from './QueueService';

describe('QueueService', () => {
  let queueService: QueueService<unknown>;

  const req = { method: 'some_method', data: { id: 1 } };

  beforeAll(() => {
    queueService = new QueueService();
  })

  describe('.getValues', () => {  
    it('should return an empty queue', () => {
      expect(queueService.getValues()).toEqual([]);
    });
  });

  describe('.add', () => {  
    it('should add Req to the queue', () => {
      queueService.add(req);

      expect(queueService.getValues()).toEqual([req]);
    });

    it('should not add Req to the queue if it is already in there', () => {
      queueService.add(req);

      expect(queueService.getValues()).toEqual([req]);
    });
  });

  describe('.remove', () => {  
    it('should return an empty queue', () => {
      queueService.add(req);
      expect(queueService.getValues()).toEqual([req]);

      queueService.remove(req);
      expect(queueService.getValues()).toEqual([]);
    });
  });

  describe('.clear', () => {  
    it('should clear queue', () => {
      queueService.add(req);
      queueService.add({ ...req, test: true });
      expect(queueService.getValues()).toEqual([req, { ...req, test: true }]);

      queueService.clear();
      expect(queueService.getValues()).toEqual([]);
    });
  });
});
