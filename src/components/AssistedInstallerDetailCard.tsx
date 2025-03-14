import { AssistedInstallerDetailCard } from '@openshift-assisted/ui-lib/ocm';
import '../i18n';
import React from 'react';
import {
  AssistedInstallerOCMPermissionTypesListType,
  FeatureListType,
} from '@openshift-assisted/ui-lib/common';
import { HistoryRouterProps } from 'react-router-dom-v5-compat';

export default function WrappedComponent(
  props: React.JSX.IntrinsicAttributes & {
    aiClusterId: string;
    allEnabledFeatures: FeatureListType;
    history: HistoryRouterProps['history'];
    basename: HistoryRouterProps['basename'];
    permissions?: AssistedInstallerOCMPermissionTypesListType;
  },
) {
  // Debugging de props
  console.debug('[FEDERATED] Props recibidos:', {
    aiClusterId: props.aiClusterId,
    permissions: props.permissions,
  });

  return <AssistedInstallerDetailCard {...props} />;
}
