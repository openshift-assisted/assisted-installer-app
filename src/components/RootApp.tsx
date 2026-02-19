import React from 'react';
import { UILibRoutes as Routes } from '@openshift-assisted/ui-lib/ocm';
import {
  unstable_HistoryRouter as HistoryRouter,
  HistoryRouterProps,
} from 'react-router-dom-v5-compat';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import { useInitApp } from '../hooks/useInitApp';
import ChatBot from './Chatbot';

const RootApp = () => {
  const { chromeHistory } = useChrome();
  useInitApp();
  const history = chromeHistory as unknown as HistoryRouterProps['history'];
  const basename = '/openshift';
  return (
    <React.StrictMode>
      <HistoryRouter history={history} basename={basename}>
        <div>
          <Routes allEnabledFeatures={{}} />
          <ChatBot />
        </div>
      </HistoryRouter>
    </React.StrictMode>
  );
};

export default RootApp;
