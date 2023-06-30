import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

import { SocketMethod } from '../../types/socketTypes';

/*
 * API Responses
 */

export type DisconnectRes = {
  code: number;
  forceDisconnection: boolean;
  reason: string;
};

/*
 * Handlers
 */

type FulfilledHandler = ActionCreatorWithPayload<any>;
type RejectedHandler = ActionCreatorWithPayload<string>;
export type Handlers = { [K in SocketMethod]: [null | FulfilledHandler, null | RejectedHandler]; };

/*
 * State
 */

type Actions = 'connect' | 'disconnect';
export type SocketState = {
  connected: boolean;
  loading: { [K in Actions]: boolean; };
  error: null | string;
};
