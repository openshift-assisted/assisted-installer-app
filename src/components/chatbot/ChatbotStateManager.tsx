import * as React from 'react';
import { IAIClient } from '@redhat-cloud-services/ai-client-common';
import { StateManager } from '@redhat-cloud-services/ai-client-state';
import { createClientStateManager } from '@redhat-cloud-services/ai-client-state';
import { LightspeedClient } from '@redhat-cloud-services/lightspeed-client';
import { MessageEntryProps } from '@openshift-assisted/chatbot';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { ScalprumComponent } from '@scalprum/react-core';
import { getBaseUrl } from '../../hooks/useInitApp';
import { AsyncMessagePlaceholder } from './AsyncMessagePlaceholder';

// TODO import types from astro
type ClientAuthStatus = {
  loading: boolean;
  isAuthenticated: boolean;
  error?: Error;
};

type StateManagerConfiguration<S extends IAIClient> = {
  model: string;
  hasHistory: boolean;
  canDeleteHistory: boolean;
  streamMessages: boolean;
  modelName: string;
  docsUrl: string;
  selectionTitle: string;
  selectionDescription: React.ReactNode;
  stateManager: StateManager<Record<string, unknown>, S>;
  handleNewChat?: (toggleDrawer: (isOpen: boolean) => void) => void;
  MessageEntryComponent?: React.ComponentType<
    Omit<MessageEntryProps, 'onApiCall' | 'openClusterDetails'>
  >;
  FooterComponent?: React.ComponentType<unknown>;
  isPreview?: boolean;
};

type AsyncStateManager<S extends IAIClient> = {
  useIsAuthenticated: () => ClientAuthStatus;
  useStateManager: () => StateManagerConfiguration<S>;
};

const LSCMessageEntry = (
  props: Omit<MessageEntryProps, 'onApiCall' | 'openClusterDetails'>,
) => {
  const messageProps = {
    scope: 'assistedInstallerApp',
    module: './ChatbotMessageEntry',
    fallback: null,
  };

  return (
    <ScalprumComponent
      {...props}
      {...messageProps}
      fallback={<AsyncMessagePlaceholder />}
    />
  );
};

const ChatbotStateManager: AsyncStateManager<IAIClient> = {
  useStateManager: () => {
    const chrome = useChrome();
    return React.useMemo(() => {
      const api = new URL(getBaseUrl());
      const client = new LightspeedClient({
        baseUrl: `https://assisted-chat.${api.hostname}`,
        fetchFunction: async (input, init) => {
          const token = await chrome.auth.getToken();
          return fetch(input, {
            ...init,
            headers: {
              ...init?.headers,
              Authorization: `Bearer ${token}`,
            },
          });
        },
      });
      const stateManager = createClientStateManager(client);
      const config: StateManagerConfiguration<LightspeedClient> = {
        model: 'OpenShift assisted Installer',
        isPreview: true,
        stateManager,
        hasHistory: true,
        canDeleteHistory: true,
        streamMessages: true,
        modelName: 'OpenShift Assisted Installer',
        docsUrl: '#',
        selectionTitle: 'OpenShift Assisted Installer',
        selectionDescription: 'TBD',
        MessageEntryComponent: LSCMessageEntry,
        handleNewChat: async (toggleDrawer) => {
          // can't use hooks here, we are not yet within the correct React context
          await stateManager.createNewConversation();
          toggleDrawer(false);
        },
      };

      return config;
    }, []);
  },
  useIsAuthenticated: () => {
    const [authStatus, setAuthStatus] = React.useState<ClientAuthStatus>({
      loading: true,
      isAuthenticated: false,
    });

    const chrome = useChrome();
    React.useEffect(() => {
      (async () => {
        const token = await chrome.auth.getToken();
        const api = new URL(getBaseUrl());
        try {
          const response = await fetch(
            `https://assisted-chat.${api.hostname}/v1/conversations`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          setAuthStatus({
            isAuthenticated: response.ok,
            loading: false,
          });
        } catch (error) {
          console.error('Error checking authentication:', error);
          setAuthStatus({
            isAuthenticated: false,
            loading: false,
          });
          authStatus.isAuthenticated = false;
        }
      })();
    }, []);
    return authStatus;
  },
};

export default ChatbotStateManager;
