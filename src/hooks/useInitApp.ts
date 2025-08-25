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

const envs: { [key: string]: string } = {
  integration: 'https://api.integration.openshift.com',
  staging: 'https://api.stage.openshift.com',
  production: 'https://api.openshift.com',
};

const ENV_OVERRIDE_LOCALSTORAGE_KEY = 'ocmOverridenEnvironment';

const parseEnvQueryParam = (): string | undefined => {
  const queryParams = new URLSearchParams(window.location.search);
  const envVal = queryParams.get('env');
  return envVal && envs[envVal] ? envVal : undefined;
};

export const getBaseUrl = (): string => {
  const queryEnv =
    parseEnvQueryParam() || localStorage.getItem(ENV_OVERRIDE_LOCALSTORAGE_KEY);
  if (queryEnv && envs[queryEnv]) {
    return envs[queryEnv];
  }
  const defaultEnv =
    window.location.host.includes('dev') || window.location.host.includes('foo')
      ? 'staging'
      : 'production';
  return envs[defaultEnv];
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
