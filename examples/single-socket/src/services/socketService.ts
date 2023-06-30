import { socketMethodEntries } from '../constants/socketConstants';
import { SocketMetaData, SocketMethod, SocketRequest } from '../types/socketTypes';

const getSocketRequestMeta = <M extends SocketMethod>(id: SocketMethod) => {
  const meta = socketMethodEntries.find(([, methodId]) => methodId === id);
  if (!meta) return null;

  return { method: meta[0] as keyof SocketMethod, id: meta[1] as M };
};

export const buildSocketRequest = <M extends SocketMethod, P>(
  id: M,
  params?: P
): SocketRequest<SocketMetaData<M>, P> => {
  const meta = getSocketRequestMeta<M>(id);
  if (!meta) throw new Error('Unexpected socket method name');

  return { id: meta.id, method: meta.method, ...(params ? { params } : {}) };
};
