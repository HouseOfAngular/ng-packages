import { ValidationMessage } from './validation-message.js';

export interface ValidationMessagesConfig {
  [key: string]: string | ValidationMessage;
}

export type ValidationMessagesEnhancedConfig = {
  [key: Exclude<string, 'pattern'>]: string | ValidationMessage;
} & { pattern?: { [regex: string]: ValidationMessage } };
