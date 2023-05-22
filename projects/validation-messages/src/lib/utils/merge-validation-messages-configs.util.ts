import {
  ValidationMessage,
  ValidationMessagesConfig,
} from '../resources/interfaces';
import { angularValidatorsWithValueMap } from '../resources/const';

const getValidatorValue = (key: string): string => {
  return (angularValidatorsWithValueMap as any)[key] || key; // types
};

export const mergeValidationMessagesConfigs = (
  config: ValidationMessagesConfig,
  toBeMerged: ValidationMessagesConfig
) => {
  config = { ...config };
  toBeMerged = { ...toBeMerged };

  for (const key in toBeMerged) {
    const value = toBeMerged[key];

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
