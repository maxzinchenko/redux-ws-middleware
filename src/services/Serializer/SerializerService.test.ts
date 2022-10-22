import { SerializerService } from './SerializerService';

describe('SerializerService', () => {
  let serializerService: SerializerService<unknown, unknown>;

  let serializer: jest.Mock;
  let deserializer: jest.Mock;

  beforeEach(() => {
    serializer = jest.fn();
    deserializer = jest.fn();
    serializerService = new SerializerService(serializer, deserializer);
  });

  describe('.serialize', () => {  
    it('should serizlize payload object into a string', () => {
      const payload = { test: true, values: [1, 2, 3] };
      const serializedPayload = serializerService.serialize(payload);

      expect(serializer).toBeCalledWith(payload);
      expect(serializer).toBeCalledTimes(1);
      expect(serializedPayload).toEqual(JSON.stringify(payload));
    });

    it('should serizlize the string', () => {
      const payload = 'some string for the test';
      const serializedPayload = serializerService.serialize(payload);

      expect(serializer).toBeCalledWith(payload);
      expect(serializer).toBeCalledTimes(1);
      expect(serializedPayload).toEqual(payload);
    });
  });

  describe('.deserialize', () => {  
    it('should deserizlize JSON string into an object', () => {
      const payload = { test: true, values: [1, 2, 3] };
      const payloadStringified = JSON.stringify(payload);
      const deserializedPayload = serializerService.deserialize(payloadStringified);

      expect(deserializer).toBeCalledWith(payload);
      expect(deserializer).toBeCalledTimes(1);
      expect(deserializedPayload).toEqual(payload);
    });

    it('should deserizlize incorrect JSON string', () => {
      const payload = 'some incorrect json for the test';
      const deserializedPayload = serializerService.deserialize(payload);

      expect(deserializer).toBeCalledWith(payload);
      expect(deserializer).toBeCalledTimes(1);
      expect(deserializedPayload).toEqual(payload);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
