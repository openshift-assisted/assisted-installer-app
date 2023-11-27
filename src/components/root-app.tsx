import React, { useEffect, useState } from 'react';
import { Api, Config, Routes } from '@openshift-assisted/ui-lib/ocm';
import type { FeatureListType } from '@openshift-assisted/ui-lib/common';
import { BrowserRouter } from 'react-router-dom';
import '../i18n';
import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

const { setRouteBasePath } = Config;
setRouteBasePath('/assisted-installer');

//TODO: we need to get this from env variable
const apiGateway = 'https://api.stage.openshift.com';

export const buildAuthInterceptor = (
  token: string
): ((client: AxiosInstance) => AxiosInstance) => {
  const authInterceptor = (client: AxiosInstance): AxiosInstance => {
    client.interceptors.request.use(async (cfg) => {
      const BASE_URL = cfg.baseURL || apiGateway;
      const updatedCfg: AxiosRequestConfig = {
        ...cfg,
        url: `${BASE_URL}${cfg.url ? cfg.url : ''}`,
      };
      if (token) {
        updatedCfg.headers = {
          ...updatedCfg.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return updatedCfg;
    });
    return client;
  };
  return authInterceptor;
};

const RootApp: React.FC<{ allEnabledFeatures: FeatureListType }> = (props) => {
  const { auth } = useChrome();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    auth
      .getUser()
      .then(() => auth.getToken())
      .then((token) => {
        if (token) {
          Api.setAuthInterceptor(buildAuthInterceptor(token));
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return null;
  return (
    <React.StrictMode>
      <BrowserRouter basename={'/openshift'}>
        <Routes allEnabledFeatures={props.allEnabledFeatures} />
      </BrowserRouter>
    </React.StrictMode>
  );
};

RootApp.displayName = 'RootApp';

export default RootApp;
