import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { socketActions } from './store/Socket/socketSlice';
import { selectSocketState } from './store/Socket/socketSelectors';

export const Socket = () => {
  const dispatch = useDispatch();
  const socketState = useSelector(selectSocketState);

  const handleConnectClick = () => {
    dispatch(socketActions.connect());
  };

  const handleDisconnectClick = () => {
    dispatch(socketActions.disconnect());
  };

  return (
    <section>
      <h3>Socket Connection</h3>

      <pre>{JSON.stringify(socketState, null, 4)}</pre>
      <button onClick={handleConnectClick}>Connect Socket</button>
      <button onClick={handleDisconnectClick}>Disconnect Socket</button>
    </section>
  );
};
