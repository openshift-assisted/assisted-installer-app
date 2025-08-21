import { Api, Config } from '@openshift-assisted/ui-lib/ocm';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

import '../i18n';

declare global {
  interface Window {
    ocmConfig?: {
      configData?: {
        apiGateway?: string;
      };
    };
  }
}

let initialized = false;

export const getBaseUrl = (): string => {
  if (window.location.hostname === 'console.dev.redhat.com') {
    return 'https://api.stage.openshift.com';
  }
  return 'https://api.openshift.com';
};

const buildAuthInterceptor = (): ((client: AxiosInstance) => AxiosInstance) => {
  const authInterceptor = (client: AxiosInstance): AxiosInstance => {
    client.interceptors.request.use((config) => {
      const BASE_URL = config.baseURL || getBaseUrl();
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

export const useInitApp = () => {
  if (!initialized) {
    // init only once
    initialized = true;
    Config.setRouteBasePath('/assisted-installer-app');
    Api.setAuthInterceptor(buildAuthInterceptor());
  }
};
