import { Serializer, Deserializer } from './SerializerService.types';

export class SerializerService<Serializable, Deserializable, Serialized = Serializable, Deserialized = Deserializable> {
  private readonly serializer?: Serializer<Serializable, Serialized>;
  private readonly deserializer?: Deserializer<Deserializable, Deserialized>;

  constructor(
    serializer?: Serializer<Serializable, Serialized>,
    deserializer?: Deserializer<Deserializable, Deserialized>
  ) {
    this.serializer = serializer;
    this.deserializer = deserializer;
  }

  serialize = (data: Serializable): string => {
    const serializedData = this.serializer?.(data) || data;

    return typeof serializedData === 'string' ? serializedData : JSON.stringify(serializedData);
  };

  deserialize = (data: string): Deserialized => {
    let parsedData;

    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = data;
    }

    return this.deserializer?.(parsedData) || parsedData;
  };
}
