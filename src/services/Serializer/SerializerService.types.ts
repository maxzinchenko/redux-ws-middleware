export type Serializer<Serializable, Serialized> = (data: Serializable) => Serialized;
export type Deserializer<Deserializable, Deserialized> = (data: Deserializable) => Deserialized;
