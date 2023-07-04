import { InjectionToken } from '@angular/core';
import { ValidationMessagesConfig } from '../interfaces';

export const VALIDATION_MESSAGES_CONFIG =
  new InjectionToken<ValidationMessagesConfig>('validation-messages-config');

export const defaultValidationMessagesConfigProvider = {
  provide: VALIDATION_MESSAGES_CONFIG,
  useValue: {},
};
