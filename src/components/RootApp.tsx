import React from 'react';
import { UILibRoutes as Routes } from '@openshift-assisted/ui-lib/ocm';
import { HistoryRouterProps } from 'react-router-dom-v5-compat';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import { useInitApp } from '../hooks/useInitApp';
import ChatBot from './Chatbot';

const RootApp = () => {
  const { chromeHistory } = useChrome();
  useInitApp();
  return (
    <React.StrictMode>
      <div>
        <Routes
          allEnabledFeatures={{}}
          history={chromeHistory as unknown as HistoryRouterProps['history']}
          basename="/openshift"
          additionalComponents={<ChatBot />}
        />
      </div>
    </React.StrictMode>
  );
};

export default RootApp;
