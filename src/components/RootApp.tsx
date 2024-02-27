import React, { useEffect, useState } from 'react';
import { Api, Config, Routes } from '@openshift-assisted/ui-lib/ocm';
import type { FeatureListType } from '@openshift-assisted/ui-lib/common';
import { BrowserRouter } from 'react-router-dom';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import '../i18n';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const apiGatewayStage = 'https://api.stage.openshift.com';
const apiGatewayProd = 'https://api.openshift.com';

const getBaseUrl = (environment: string): string => {
  if (environment === 'prod') {
    return apiGatewayProd;
  }
  return apiGatewayStage;
};

export const buildAuthInterceptor = (
  environment: string,
): ((client: AxiosInstance) => AxiosInstance) => {
  const authInterceptor = (client: AxiosInstance): AxiosInstance => {
    client.interceptors.request.use((config) => {
      const BASE_URL = config.baseURL || getBaseUrl(environment);
      const updatedConfig: AxiosRequestConfig = {
        ...config,
        url: `${BASE_URL}${config.url}`,
      };
      return updatedConfig;
    });
    return client;
  };
  return authInterceptor;
};

function RootApp({
  allEnabledFeatures,
  routeBasePath = '/assisted-installer-app',
}: {
  allEnabledFeatures: FeatureListType;
  routeBasePath?: string;
}) {
  const [hasNotBeenSetted, setHasNotBeenSetted] = useState(true);
  const chrome = useChrome();
  useEffect(() => {
    Config.setRouteBasePath(routeBasePath);
    if (hasNotBeenSetted) {
      Api.setAuthInterceptor(buildAuthInterceptor(chrome.getEnvironment()));
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
