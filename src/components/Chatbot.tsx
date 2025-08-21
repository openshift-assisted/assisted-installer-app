import * as React from 'react';
import {
  ChatBot as AIChatBot,
  ChatBotWindowProps,
} from '@openshift-assisted/chatbot';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useNavigate } from 'react-router-dom-v5-compat';

import { useAMSCapability } from '../hooks/useAMSCapability';
import { useUsername } from '../hooks/useUsername';
import { getBaseUrl } from '../hooks/useInitApp';

import '@patternfly-6/chatbot/dist/css/main.css';
import './Chatbot.scss';

const CHATBOT_CAPABILITY_NAME = 'capability.account.ai_chatbot';

const ChatBot = () => {
  const [username, isUsernameLoading] = useUsername();
  const [isEnabled, isLoading] = useAMSCapability(CHATBOT_CAPABILITY_NAME);
  const chrome = useChrome();
  const navigate = useNavigate();

  const onApiCall = React.useCallback<ChatBotWindowProps['onApiCall']>(
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
    ChatBotWindowProps['openClusterDetails']
  >(
    (id) => {
      navigate(`/assisted-installer/clusters/${id}`);
    },
    [navigate],
  );

  return (
    isEnabled &&
    !isLoading &&
    !isUsernameLoading && (
      <div className="assisted-installer-app">
        <AIChatBot
          onApiCall={onApiCall}
          username={username || 'Assisted Installer user'}
          openClusterDetails={openClusterDetails}
        />
      </div>
    )
  );
};

export default ChatBot;
