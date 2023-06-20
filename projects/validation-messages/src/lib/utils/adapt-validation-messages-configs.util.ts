import {
  ValidationMessage,
  ValidationMessagesConfig,
} from '../resources/interfaces';
import { angularValidatorsWithValueMap } from '../resources/const';

const getValidatorValue = (key: string): string => {
  return (angularValidatorsWithValueMap as any)[key] || key; // types
};

export const adaptValidationMessagesConfigs = (
  toBeAdapted: ValidationMessagesConfig
): Record<string, any> => {
  const config: Record<string, any> = {};
  toBeAdapted = { ...toBeAdapted };

  for (const key in toBeAdapted) {
    const value = toBeAdapted[key];

    if (typeof value === 'string') {
      config[key] = {
        message: value,
        validatorValue: getValidatorValue(key),
      };
    } else {
      const validator = value as ValidationMessage;

      if (validator.pattern) {
        config['pattern'] = {
          ...(config['pattern'] as ValidationMessage),
          [validator.pattern]: validator,
        };
      } else {
        config[key] = validator;
      }
    }
  }

  return { ...config };
};
