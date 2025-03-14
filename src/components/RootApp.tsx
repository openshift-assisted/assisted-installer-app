import React from 'react';
import { UILibRoutes as Routes } from '@openshift-assisted/ui-lib/ocm';
import '../i18n';
import { HistoryRouterProps } from 'react-router-dom-v5-compat';
import { useInitApp } from '../hooks/useInitApp';

const RootApp = ({
  routeBasePath = '/assisted-installer-app',
  history,
}: {
  routeBasePath?: string;
  history?: HistoryRouterProps['history'];
}) => {
  useInitApp(routeBasePath);
  return (
    <React.StrictMode>
      <Routes
        allEnabledFeatures={{}}
        history={history}
        basename={'/openshift'}
      />
    </React.StrictMode>
  );
};

export default RootApp;
