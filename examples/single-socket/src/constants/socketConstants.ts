import { SocketMethod } from '../types/socketTypes';

export const socketMethodEntries = Object.entries(SocketMethod) as [keyof SocketMethod, SocketMethod][];
