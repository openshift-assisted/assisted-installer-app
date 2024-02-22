import React, { useEffect } from 'react';
import { Config, Routes } from '@openshift-assisted/ui-lib/ocm';
import type { FeatureListType } from '@openshift-assisted/ui-lib/common';
import { BrowserRouter } from 'react-router-dom';
import '../i18n';

function RootApp({
  allEnabledFeatures,
  routeBasePath = '/assisted-installer-app',
}: {
  allEnabledFeatures: FeatureListType;
  routeBasePath?: string;
}) {
  useEffect(() => {
    Config.setRouteBasePath(routeBasePath);
  }, []);

  return (
    <React.StrictMode>
      <BrowserRouter basename={'/openshift'}>
        <Routes allEnabledFeatures={allEnabledFeatures} />
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default RootApp;
