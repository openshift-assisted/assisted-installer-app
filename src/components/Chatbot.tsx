import * as React from 'react';
// eslint-disable-next-line
// @ts-ignore
import { ChatBot as AIChatBot } from '@openshift-assisted/chatbot';
import { ocmClient } from '@openshift-assisted/ui-lib/common';

import '@patternfly-6/chatbot/dist/css/main.css';
import './Chatbot.scss';

type Capability = { name: string; value: string };
type CapabilitiesList = { items?: Capability[] };

const CHATBOT_CAPABILITY_NAME = 'capability.account.ai_chatbot';

const ChatBot = () => {
  const [isEnabled, setIsEnabled] = React.useState(false);
  React.useEffect(() => {
    const doItAsync = async () => {
      try {
        const res = await ocmClient?.get<CapabilitiesList>(
          '/api/accounts_mgmt/v1/default_capabilities',
        );
        const enabled = !!res?.data.items?.some(
          ({ name, value }) =>
            name === CHATBOT_CAPABILITY_NAME && value === 'true',
        );
        setIsEnabled(enabled);
      } catch (err) {
        console.error('failed to query default capabilities', err);
        setIsEnabled(false);
      }
    };
    doItAsync();
  }, []);
  return (
    isEnabled && (
      <div className="assisted-installer-app">
        <AIChatBot />
      </div>
    )
  );
};

export default ChatBot;
