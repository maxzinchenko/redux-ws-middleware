import React from 'react';

import { Socket } from './Socket';
import { Market } from './Market';

export const App = () => (
  <main>
    <h1>Redux Ws Middleware</h1>
    <h2>Binance Market Socket Api</h2>

    <Socket />
    <Market />
  </main>
);
