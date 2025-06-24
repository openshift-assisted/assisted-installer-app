import * as React from 'react';
import {
  ChatBot as AIChatBot,
  ChatBotWindowProps,
} from '@openshift-assisted/chatbot';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import { useAMSCapability } from '../hooks/useAMSCapability';
import { useUsername } from '../hooks/useUsername';

import '@patternfly-6/chatbot/dist/css/main.css';
import './Chatbot.scss';

const CHATBOT_CAPABILITY_NAME = 'capability.account.ai_chatbot';

const ChatBot = () => {
  const [username, isUsernameLoading] = useUsername();
  const [isEnabled, isLoading] = useAMSCapability(CHATBOT_CAPABILITY_NAME);
  const chrome = useChrome();

  const onApiCall: ChatBotWindowProps['onApiCall'] = async (input, init) => {
    const userToken = await chrome.auth.getToken();
    return fetch(
      `${window.ocmConfig?.configData?.apiGateway}/api/assisted_chat${input}`,
      {
        ...(init || {}),
        headers: {
          ...(init?.headers || {}),
          Authorization: `Bearer ${userToken}`,
        },
      },
    );
  };

  return (
    isEnabled &&
    !isLoading &&
    !isUsernameLoading && (
      <div className="assisted-installer-app">
        <AIChatBot
          onApiCall={onApiCall}
          username={username || 'Assisted Installer user'}
        />
      </div>
    )
  );
};

export default ChatBot;
