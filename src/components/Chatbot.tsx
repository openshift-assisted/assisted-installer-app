import * as React from 'react';
import {
  ChatBot as AIChatBot,
  ApiCallFunction,
} from '@openshift-assisted/chatbot';
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
        setIsEnabled(!enabled);
      } catch (err) {
        console.error('failed to query default capabilities', err);
        setIsEnabled(false);
      }
    };
    doItAsync();
  }, []);

  // eslint-disable-next-line
  // @ts-ignore
  const axiosApiCall: ApiCallFunction = async (body) => {
    if (!ocmClient) {
      return;
    }
    const axiosResponse = await ocmClient.post(
      'https://prod.foo.redhat.com:1337/chat/v1/query',
      JSON.stringify(body),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    // Convert axios response to fetch-like Response object
    return {
      json: async () => Promise.resolve(axiosResponse.data),
      ok: axiosResponse.status >= 200 && axiosResponse.status < 300,
      status: axiosResponse.status,
    } as Response;
  };

  return (
    isEnabled && (
      <div className="assisted-installer-app">
        <AIChatBot onApiCall={axiosApiCall} />
      </div>
    )
  );
};

export default ChatBot;
