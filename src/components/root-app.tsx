import React from 'react';
import { Config, Routes } from '@openshift-assisted/ui-lib/ocm';
import type { FeatureListType } from '@openshift-assisted/ui-lib/common';
import { BrowserRouter } from 'react-router-dom';
import '../i18n';

const { setRouteBasePath } = Config;
setRouteBasePath('/assisted-installer');

const RootApp: React.FC<{ allEnabledFeatures: FeatureListType }> = (props) => (
  <React.StrictMode>
    <BrowserRouter basename={'/openshift'}>
      <Routes allEnabledFeatures={props.allEnabledFeatures} />
    </BrowserRouter>
  </React.StrictMode>
);

RootApp.displayName = 'RootApp';

export default RootApp;
