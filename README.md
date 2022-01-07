# Redux Awesome Socket Middleware

This package makes web socket management much easier with redux.

<a href="https://npmjs.com/package/redux-awesome-socket-middleware" target="\_parent">
  <img alt="npm version" src="https://img.shields.io/npm/v/redux-awesome-socket-middleware.svg" />
</a><a href="https://npmjs.com/package/redux-awesome-socket-middleware" target="\_parent">
  <img alt="npm downloads" src="https://img.shields.io/npm/dm/redux-awesome-socket-middleware.svg" />
</a>

`v1.0.5` - Stable

## Changelog

`v1.0.5` - Fixed ESNext webpack compilation/parsing error<br>

## Installation

```
# using npm
npm install redux-awesome-socket-middleware

# using yarn
yarn add redux-awesome-socket-middleware
```

[comment]: <> (## [Example of Usage]&#40;https://github.com/maxzinchenko/react-awesome-form-hook/blob/master/example/src/App.tsx&#41;)

## Options

| Name                                           | Required | Type                                                | Default     |
| ---------------------------------------------- | -------- | --------------------------------------------------- | ----------- |
| [url](#url)                                    | Yes      | `string`                                            | -           |
| [actionTypes](#actionTypes)                    | Yes      | `Array<string OR RegExp>`                           | -           |
| [completedActionTypes](#completedActionTypes)  | Yes      | `Array<string>`                                     | -           |
| [onMessage](#onMessage)                        | Yes      | `(res: Res, dispatch: Dispatch<AnyAction>) => void` | -           |
| [autoConnect](#autoConnect)                    | No       | `boolean`                                           | `true`      |
| [shouldReconnect](#shouldReconnect)            | No       | `((event: CloseEvent) => boolean) OR boolean`         | `true`      |
| [debug](#debug)                                | No       | `boolean`                                           | -           |
| [protocols](#protocols)                        | No       | `string OR string[]`                                | -           |
| [reconnectionIntervals](#reconnectionInterval) | No       | `number OR number[]`                                | `1000`      |
| [serialize](#serialize)                        | No       | `(req: Req) => SReq`                                | -           | 
| [deserialize](#deserialize)                    | No       | `(res: Res) => DRes`                                | -           |

--------

## url (required)

`string`

Url for the <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket">WebSocket</a> constructor.

```ts
url: 'ws://localhost:3000'
```

```ts
url: 'wss://example.com'
```

## actionTypes (required)

`[RegExp | string, RegExp | string, RegExp | string]`

<b>WARNING: Sequence is important!</b><br>

Types that you are able to manage the socket with.<br>
You can manage socket be dispatching any of them.

The first element should be the `SEND` action type.<br>
Second - `CONNECT` type. <br>
Third - `DISCONNECT` type.

```ts
actionTypes: ['SEND', 'CONNECT', 'DISCONNECT']
```

```ts
actionTypes: [new RegExp(/_REQUEST/g), 'CONNECT', 'DISCONNECT']
```

If you don't need these: `CONNECT`, `DISCONNECT` so just don't send them.

```ts
actionTypes: ['SEND', 'CONNECT']
```

```ts
actionTypes: ['SEND']
```

```ts
actionTypes: [new RegExp(/_REQUEST/g)]
```

## completedActionTypes (required)

`[string, string]`

<b>WARNING: Sequence is important!</b>

Types that you receive back on actions.

```ts
completedActionTypes: ['CONNECTED', 'DISCONNECTED']
```

## onMessage (required)

`(res: Res, dispatch: Dispatch<AnyAction>) => void`

The callback gets called with deserialized data already, if you put deserialize function into options, or with a normal data if you don't. And with a `dispatch` so you can manage your store.

*(this is just an example of the `onMessage` handler)

```ts
onMessage: (data, dispatch) => {
  switch (data.method) {
    case 'posts':
      if (data.error) {
        dispatch(postsActions.getPostsRejected(data.error));
      } else {
        dispatch(postsActions.getPostsFulfilled(data.result));
      }
      break;
      
    ...
      
    default:
      break;
  }
}
```

## autoConnect

`boolean` - (`true` by default)

When `true` you don't need to send anything else to connect it.<br>
When `false` you need to dispatch the connect action with a type  `actionTypes[1]`.

```ts
autoConnect: false
```

## shouldReconnect

`((event: CloseEvent) => boolean) | boolean` - (`true` by default)

When `true` the socket tries to reconnect if close status !== 1001.<br>
When predicate is passed you are able to decide if the sockets needs to be reconnected.

```ts
shouldReconnect: false
```

## debug

`boolean`

When `true` the package shows additional logs.

```ts
debug: ture
```

## protocols

`boolean`

Protocols for the <a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket">WebSocket</a> constructor.

```ts
protocols: 'some protocol'
```

```ts
protocols: ['some protocol']
```

## reconnectionInterval

`number | number[]` - (`1000` by default)

<b>In milliseconds.</b><br>
When array each new connection uses the next number from the array for a timeout to avoid DDOSing a server.

```ts
reconnectionInterval: 1000
```

When reconnection count reaches the last array element it uses it each the next time.<br>
When the socket connects back the next reconnection loop will start from the `0` index.

```ts
reconnectionInterval: [0, 1000, 2000, 3000, 4000, 5000, 10000]
```

## serialize

`(req: Req) => SReq`<br>
`Req` and `SReq` are templates of the generic `MiddlewareOptions` type

The format function gets called to prepare the data to get submitted to the server. For example, `camelCase` to `snake_case` conversion.

```ts
serialize: req => {
  return {
    ...req,
    time: Date.now()
  }
}
```

## deserialize

`(res: Res) => DRes`<br>
`Res` and `DRes` are templates of the generic `MiddlewareOptions` type

The format function gets called to prepare the message to get submitted to the `onMessage` callback. For example, `snake_case` to `camelCase` conversion.

```ts
deserialize: res => {
  return res.data
}
```


---


## Managing the socket

### Connecting
```ts
const SOCKET_SEND = 'SCOKET_SEND';
const SOCKET_CONNECT = 'SOCKET_CONNECT';
const SOCKET_DISCONNECT = 'SOCKET_DISCONNECT';

const otpions = {
  ...
  actionTypes: [SOCKET_SEND, SOCKET_CONNECT, SOCKET_DISCONNECT],
  ...
}

dispatch({ type: SOCKET_CONNECT });
```

### Disconnecting
```ts
const SOCKET_SEND = 'SCOKET_SEND';
const SOCKET_CONNECT = 'SOCKET_CONNECT';
const SOCKET_DISCONNECT = 'SOCKET_DISCONNECT';

const otpions = {
  ...
  actionTypes: [SOCKET_SEND, SOCKET_CONNECT, SOCKET_DISCONNECT],
  ...
}

dispatch({ type: SOCKET_DISCONNECT });
```

### Sending data

The data can be sent in `payload` OR in `data` key.

```ts
const GET_POSTS = 'GET_POSTS_REQUEST';

const otpions = {
  ...
  actionTypes: [new RegExp(/_REQUEST/g)],
  ...
}

dispatch({ type: GET_POSTS, payload: { offset: 0, limit: 20 } });

OR

dispatch({ type: GET_POSTS, data: { offset: 0, limit: 20 } });
```


---

## Options example

```ts
import { createSocketMiddleware, MiddlewareOptions } from 'redux-awesome-socket-middleware';

type SocketRes = {
  method: string;
  result: {};
};

type ScoketReq = {
  method: string;
  data: {}
};

const options: MiddlewareOptions<ScoketReq, SocketRes> = {
  url: 'ws://localhost:3000',
  actionTypes: ['SEND', 'CONNECT', 'DISCONNECT'],
  completedActionTypes: ['CONNECTED', 'DISCONNECTED']
};

const socketMiddleware = createSocketMiddleware(options);
```
