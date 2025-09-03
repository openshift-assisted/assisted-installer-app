import * as React from 'react';
import { getBaseUrl } from './useInitApp';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

type Capability = { name: string; value: string };
type Capabilities = { items?: Capability[] };
type CurrentAccount = { organization: { id: string } };

export const useAMSCapability = (
  capabilityName: string,
): [boolean, boolean, unknown] => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown>();
  const chrome = useChrome();
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

        if (enabled) {
          setIsEnabled(true);
          return;
        }

        const user = await chrome.auth.getUser();
        if (user) {
          const resp = await fetch(
            `${getBaseUrl()}/api/accounts_mgmt/v1/current_account`,
          );

          const currentAcc = (await resp.json()) as CurrentAccount;

          if (currentAcc.organization.id) {
            const resp = await fetch(
              `${getBaseUrl()}/api/accounts_mgmt/v1/organizations/${
                currentAcc.organization.id
              }?fetchCapabilities=true`,
            );

            const orgCapabilities = (await resp.json()) as {
              capabilities: Capability[];
            };
            const orgCapEnabled = orgCapabilities.capabilities?.some(
              ({ name, value }) => name === capabilityName && value === 'true',
            );
            if (orgCapEnabled) {
              setIsEnabled(true);
            }
          }
        }
      } catch (err) {
        console.error('failed to query capabilities', err);
        setError(err);
        setIsEnabled(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [capabilityName]);

  return [isEnabled, isLoading, error];
};
