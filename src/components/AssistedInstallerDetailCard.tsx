import * as React from 'react';
import { AssistedInstallerDetailCard as AIDetailsCard } from '@openshift-assisted/ui-lib/ocm';
import { useInitApp } from '../hooks/useInitApp';
import '../i18n';

type DetailsCardProps = React.ComponentProps<typeof AIDetailsCard> & {
  routeBasePath: string;
};

const AssistedInstallerDetailCard: React.FC<DetailsCardProps> = ({
  routeBasePath,
  ...rest
}) => {
  useInitApp(routeBasePath);
  return <AIDetailsCard {...rest} />;
};

export default AssistedInstallerDetailCard;
