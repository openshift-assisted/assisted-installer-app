import React from 'react';
import {
  Api,
  Config,
  UILibRoutes as Routes,
} from '@openshift-assisted/ui-lib/ocm';
import { AxiosInstance } from 'axios';
import '../i18n';
import { HistoryRouterProps } from 'react-router-dom-v5-compat';

function RootApp({
  routeBasePath = '/assisted-installer-app',
  authInterceptor,
  history,
}: {
  routeBasePath?: string;
  authInterceptor: (client: AxiosInstance) => AxiosInstance;
  history?: HistoryRouterProps['history'];
}) {
  Api.setAuthInterceptor(authInterceptor);

  Config.setRouteBasePath(routeBasePath);

  return (
    <React.StrictMode>
      <Routes
        allEnabledFeatures={{}}
        history={history}
        basename={'/openshift'}
      />
    </React.StrictMode>
  );
}

export default RootApp;
