import { Serializer, Deserializer } from './SerializerServiceTypes';

export class SerializerService<Serializable, Deserializable, Serialized = Serializable, Deserialized = Deserializable> {
  readonly #serializer?: Serializer<Serializable, Serialized>;
  readonly #deserializer?: Deserializer<Deserializable, Deserialized>;

  constructor(
    serializer?: Serializer<Serializable, Serialized>,
    deserializer?: Deserializer<Deserializable, Deserialized>
  ) {
    this.#serializer = serializer;
    this.#deserializer = deserializer;
  }

  serialize = (data: Serializable): string => {
    const serializedData = this.#serializer?.(data) || data;

    return typeof serializedData === 'string' ? serializedData : JSON.stringify(serializedData);
  };

  deserialize = (data: string): Deserialized => {
    let parsedData;

    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = data;
    }

    return this.#deserializer?.(parsedData) || parsedData;
  };
}
