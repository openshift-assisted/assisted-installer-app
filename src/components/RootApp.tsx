import React, { useEffect, useState } from 'react';
import { Api, Config, Routes } from '@openshift-assisted/ui-lib/ocm';
import type { FeatureListType } from '@openshift-assisted/ui-lib/common';
import { BrowserRouter } from 'react-router-dom';
import { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import '../i18n';

const apiGateway = 'https://api.stage.openshift.com';

const authInterceptor = (client: AxiosInstance): AxiosInstance => {
  client.interceptors.request.use((config) => {
    const BASE_URL = config.baseURL || apiGateway;
    const updatedConfig: InternalAxiosRequestConfig = {
      ...config,
      url: `${BASE_URL}${config.url}`,
    };
    return updatedConfig;
  });
  return client;
};

function RootApp({
  allEnabledFeatures,
  routeBasePath = '/assisted-installer-app',
}: {
  allEnabledFeatures: FeatureListType;
  routeBasePath?: string;
}) {
  const [hasNotBeenSetted, setHasNotBeenSetted] = useState(true);

  useEffect(() => {
    Config.setRouteBasePath(routeBasePath);
    if (hasNotBeenSetted) {
      Api.setAuthInterceptor(authInterceptor);
      setHasNotBeenSetted(false);
    }
  }, [hasNotBeenSetted]);

  return (
    <React.StrictMode>
      <BrowserRouter basename={'/openshift'}>
        <Routes allEnabledFeatures={allEnabledFeatures} />
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default RootApp;
