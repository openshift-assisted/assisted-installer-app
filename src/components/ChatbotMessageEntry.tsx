import * as React from 'react';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useNavigate } from 'react-router-dom-v5-compat';
import { MessageEntry, MessageEntryProps } from '@openshift-assisted/chatbot';

import { getBaseUrl } from '../hooks/useInitApp';

const ChatbotMessageEntry = (
  props: Omit<MessageEntryProps, 'onApiCall' | 'openClusterDetails'>,
) => {
  const chrome = useChrome();
  const navigate = useNavigate();

  const onApiCall = React.useCallback<MessageEntryProps['onApiCall']>(
    async (input, init) => {
      const userToken = await chrome.auth.getToken();
      const api = new URL(getBaseUrl());
      return fetch(`https://assisted-chat.${api.hostname}${input}`, {
        ...(init || {}),
        headers: {
          ...(init?.headers || {}),
          Authorization: `Bearer ${userToken}`,
        },
      });
    },
    [],
  );

  const openClusterDetails = React.useCallback<
    MessageEntryProps['openClusterDetails']
  >(
    (id) => {
      navigate(`/openshift/assisted-installer/clusters/${id}`);
    },
    [navigate],
  );

  return (
    <MessageEntry
      onApiCall={onApiCall}
      openClusterDetails={openClusterDetails}
      {...props}
    />
  );
};

export default ChatbotMessageEntry;
