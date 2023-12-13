import React, { useEffect, useState } from "react";
import { Api, Config, Routes } from "@openshift-assisted/ui-lib/ocm";
import type { FeatureListType } from "@openshift-assisted/ui-lib/common";
import { BrowserRouter } from "react-router-dom";
import "../i18n";
import { useChrome } from "@redhat-cloud-services/frontend-components/useChrome";
import { AxiosInstance, AxiosRequestConfig } from "axios";

const apiGateway =
  process.env.REACT_APP_API_GATEWAY || "https://api.stage.openshift.com";

function getBaseUrl(baseURL: string | undefined) {
  return baseURL || apiGateway;
}

export const buildAuthInterceptor = (
  token: string | undefined
): ((client: AxiosInstance) => AxiosInstance) => {
  const authInterceptor = (client: AxiosInstance): AxiosInstance => {
    client.interceptors.request.use((config) => {
      console.log("------");
      console.log("config:", config);
      console.log("apiGateway:", apiGateway);
      console.log("token:", token);
      console.log("------");
      const BASE_URL = getBaseUrl(config.baseURL);
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

const RootApp: React.FC<{ allEnabledFeatures: FeatureListType }> = (props) => {
  const { auth } = useChrome();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    auth
      .getUser()
      .then(() => auth.getToken())
      .then((token) => {
        Api.setAuthInterceptor(buildAuthInterceptor(token));
        Config.setRouteBasePath("/assisted-installer");
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return null;
  return (
    <React.StrictMode>
      <BrowserRouter basename={"/openshift"}>
        <Routes allEnabledFeatures={props.allEnabledFeatures} />
      </BrowserRouter>
    </React.StrictMode>
  );
};

RootApp.displayName = "RootApp";

export default RootApp;
