import * as React from 'react';
import { getBaseUrl } from './useInitApp';

type Capabilities = { items?: { name: string; value: string }[] };

export const useAMSCapability = (
  capabilityName: string,
): [boolean, boolean, unknown] => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown>();
  React.useEffect(() => {
    (async () => {
      setError(undefined);
      setIsLoading(true);
      try {
        const res = await fetch(
          `${getBaseUrl()}/api/accounts_mgmt/v1/default_capabilities`,
        );
        const data = (await res.json()) as Capabilities;
        const enabled = !!data.items?.some(
          ({ name, value }) => name === capabilityName && value === 'true',
        );
        setIsEnabled(enabled);
      } catch (err) {
        console.error('failed to query default capabilities', err);
        setError(err);
        setIsEnabled(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [capabilityName]);

  return [isEnabled, isLoading, error];
};
