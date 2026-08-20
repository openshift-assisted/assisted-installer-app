import * as React from 'react';
import { HostsClusterDetailTab as AIHostsClusterDetailTab } from '@openshift-assisted/ui-lib/ocm';
import { useInitApp } from '../hooks/useInitApp';
import '../i18n';

const HostsClusterDetailTab: React.FC<
  React.ComponentProps<typeof AIHostsClusterDetailTab>
> = (props) => {
  useInitApp();
  return <AIHostsClusterDetailTab {...props} />;
};

export default HostsClusterDetailTab;
