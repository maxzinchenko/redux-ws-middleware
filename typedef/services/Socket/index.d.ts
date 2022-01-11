import { Dispatch } from '../../typedef';
import { Options } from './typedef';
export declare class Socket {
    #private;
    constructor(options: Options, dispatch: Dispatch, actionTypes: [string, string]);
    connect: () => void;
    sendMessage: <D = {}>(data: D) => void;
    disconnect: () => void;
}
