export type Serializer<Serialize, Serialized> = (data: Serialize) => Serialized;
export type Deserializer<Deserialize, Deserialized> = (data: Deserialize) => Deserialized;
