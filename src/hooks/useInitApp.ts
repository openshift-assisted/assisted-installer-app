import { Api, Config } from '@openshift-assisted/ui-lib/ocm';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { AxiosInstance, AxiosRequestConfig } from 'axios';

let initialized = false;

const apiGatewayStage = 'https://api.stage.openshift.com';
const apiGatewayProd = 'https://api.openshift.com';

const getBaseUrl = (environment: string): string => {
  if (environment === 'prod') {
    return apiGatewayProd;
  }
  return apiGatewayStage;
};

const buildAuthInterceptor = (
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

export const useInitApp = (routeBasePath = '/assisted-installer-app') => {
  const chrome = useChrome();
  if (!initialized) {
    // init only once
    initialized = true;
    Config.setRouteBasePath(routeBasePath);
    Api.setAuthInterceptor(buildAuthInterceptor(chrome.getEnvironment()));
  }
};
