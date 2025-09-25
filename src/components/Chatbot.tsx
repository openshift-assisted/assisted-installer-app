import * as React from 'react';
import {
  ChatBot as AIChatBot,
  ChatBotWindowProps,
} from '@openshift-assisted/chatbot';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useNavigate } from 'react-router-dom-v5-compat';

import { useUsername } from '../hooks/useUsername';

import '@patternfly/chatbot/dist/css/main.css';
import './Chatbot.scss';
import { getBaseUrl } from '../config/config';

// Chatbot AMS capability
// const CHATBOT_CAPABILITY_NAME = 'capability.account.ai_chatbot';

const ChatBot = () => {
  const [username, isUsernameLoading] = useUsername();
  const [isEnabled, setIsEnabled] = React.useState<boolean>();
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

  React.useEffect(() => {
    void (async () => {
      try {
        const resp = await onApiCall('/v1/conversations');
        if (resp.ok) {
          setIsEnabled(true);
        } else {
          setIsEnabled(false);
        }
      } catch {
        setIsEnabled(false);
      }
    })();
  }, [onApiCall]);

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
