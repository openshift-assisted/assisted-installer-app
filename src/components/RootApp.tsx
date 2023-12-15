import React, { useEffect, useState } from 'react';
import { Api, Config, Routes } from '@openshift-assisted/ui-lib/ocm';
import type { FeatureListType } from '@openshift-assisted/ui-lib/common';
import { BrowserRouter } from 'react-router-dom';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import '../i18n';

const apiGateway = 'https://api.stage.openshift.com';

export const buildAuthInterceptor = (
  token: string | undefined,
): ((client: AxiosInstance) => AxiosInstance) => {
  const authInterceptor = (client: AxiosInstance): AxiosInstance => {
    client.interceptors.request.use((config) => {
      const BASE_URL = config.baseURL || apiGateway;
      const updatedConfig: AxiosRequestConfig = {
        ...config,
        url: `${BASE_URL}${config.url}`,
      };
      if (token) {
        updatedConfig.headers = {
          ...updatedConfig.headers,
          Authorization: `Bearer ${token}`,
        };
      }
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
  const { auth } = useChrome();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Config.setRouteBasePath(routeBasePath);
    auth
      .getUser()
      .then(() => auth.getToken())
      .then((token) => {
        Api.setAuthInterceptor(buildAuthInterceptor(token));
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return null;

  return (
    <React.StrictMode>
      <BrowserRouter basename={'/openshift'}>
        <Routes allEnabledFeatures={allEnabledFeatures} />
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default RootApp;
