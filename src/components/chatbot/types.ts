import { ChromeAPI } from '@redhat-cloud-services/types';
import { StateManager } from '@redhat-cloud-services/ai-client-state';
import { IAIClient } from '@redhat-cloud-services/ai-client-common';

export enum Models {
  ASK_RED_HAT = 'Ask Red Hat',
  RHEL_LIGHTSPEED = 'RHEL LightSpeed',
  VA = 'Virtual Assistant',
  OAI = 'OpenShift assisted Installer',
}

export type ClientAuthStatus = {
  loading: boolean;
  isAuthenticated: boolean;
  error?: Error;
  model: Models;
};

export interface WelcomeButton {
  /** Title for the welcome button */
  title: string;
  /** Optional message to display below the title */
  message?: string;
  /** Message to send when the button is clicked */
  value: string;
}

export interface WelcomeConfig {
  /** Welcome message content to display */
  content?: string;
  /** Optional array of interactive buttons */
  buttons?: WelcomeButton[];
}

export type StateManagerConfiguration<S extends IAIClient> = {
  model: Models;
  historyManagement: boolean;
  streamMessages: boolean;
  modelName: string;
  docsUrl: string;
  selectionTitle: string;
  selectionDescription: string;
  stateManager: StateManager<Record<string, unknown>, S>;
  isPreview?: boolean;
  handleNewChat?: (toggleDrawer: (isOpen: boolean) => void) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  MessageEntryComponent?: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  FooterComponent?: React.ComponentType<any>;
  welcome?: WelcomeConfig;
};

export declare class AsyncStateManager<S extends IAIClient> {
  isAuthenticated(chrome: ChromeAPI): Promise<ClientAuthStatus>;
  getStateManager(chrome: ChromeAPI): StateManagerConfiguration<S>;
}
