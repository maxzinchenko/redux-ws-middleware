import React from 'react';
import { useSelector } from 'react-redux';

import { marketActions } from './store/Market/marketSlice';
import { useThunkDispatch } from './store/appStoreHooks';
import {
  selectMarketErrorState,
  selectMarketLoadingState,
  selectStream,
  selectSubscribedStreams
} from './store/Market/marketSelectors';

const STREAM_NAME = 'btcusdt@aggTrade';

export const Market = () => {
  const dispatch = useThunkDispatch();
  const stream = useSelector(selectStream);
  const subscribedStreams = useSelector(selectSubscribedStreams);
  const loading = useSelector(selectMarketLoadingState);
  const error = useSelector(selectMarketErrorState);

  const handleSubscribeClick = () => {
    dispatch(marketActions.subscribe([STREAM_NAME]));
  };

  const handleUnsubscribeClick = () => {
    dispatch(marketActions.unsubscribe([STREAM_NAME]));
  };

  const handleFetchSubscriptionsClick = () => {
    dispatch(marketActions.fetchSubscriptions());
  };

  return (
    <>
      <section>
        <h3>Stream Subscription</h3>
        <pre>
          {JSON.stringify(
            {
              streamName: STREAM_NAME,
              subscribed: !!stream,
              subscribe: { loading: loading.subscribe, error: error.subscribe },
              unsubscribe: { loading: loading.unsubscribe, error: error.unsubscribe }
            },
            null,
            4
          )}
        </pre>
        <button onClick={handleSubscribeClick}>Subscribe Stream</button>
        <button onClick={handleUnsubscribeClick}>Unsubscribe Stream</button>
      </section>

      <section>
        <h3>Subscriptions Details</h3>
        <pre>
          {JSON.stringify(
            { subscribedStreams, loading: loading.fetchSubscriptions, error: error.fetchSubscriptions },
            null,
            4
          )}
        </pre>
        <button onClick={handleFetchSubscriptionsClick}>Fetch Subscriptions</button>
      </section>

      <section>
        <h3>Subscribed Stream Details</h3>
        <pre>{JSON.stringify({ streamName: STREAM_NAME, stream }, null, 4)}</pre>
      </section>
    </>
  );
};
