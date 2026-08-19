import * as React from 'react';
import { HostsClusterDetailTab as AIHostsClusterDetailTab } from '@openshift-assisted/ui-lib/ocm';
import '../i18n';
import { useInitApp } from '../hooks/useInitApp';

const HostsClusterDetailTab: React.FC<
  React.ComponentProps<typeof AIHostsClusterDetailTab>
> = (props) => {
  useInitApp();
  return <AIHostsClusterDetailTab {...props} />;
};

export default HostsClusterDetailTab;
