import * as React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

export const useUsername = (): [string | undefined, boolean, unknown] => {
  const chrome = useChrome();
  const [username, setUsername] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<unknown>();
  React.useEffect(() => {
    (async () => {
      try {
        const user = await chrome.auth.getUser();
        user?.identity.user &&
          setUsername(
            `${user.identity.user.first_name} ${user.identity.user.last_name}`,
          );
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return [username, isLoading, error];
};
