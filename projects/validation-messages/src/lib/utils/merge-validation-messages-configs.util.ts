import {
  angularValidatorsWithValueMap,
  ValidationMessagesConfig,
  ValidationMessagesEnhancedConfig,
} from '../resources';

export function mergeValidationMessagesConfigs(
  config: ValidationMessagesEnhancedConfig,
  toBeMerged: ValidationMessagesConfig
): ValidationMessagesEnhancedConfig {
  config = { ...config };
  toBeMerged = { ...toBeMerged };

  for (const key in toBeMerged) {
    const value = toBeMerged[key];

    if (typeof value === 'string') {
      const validationObject = {
        message: value,
        validatorValue:
          key in angularValidatorsWithValueMap
            ? angularValidatorsWithValueMap[
                key as keyof typeof angularValidatorsWithValueMap
              ]
            : key,
      };
      if (key === 'pattern') {
        config.pattern = {
          ...config.pattern,
          default: validationObject,
        };
      } else {
        config[key] = validationObject;
      }
    } else {
      if (value.pattern) {
        config.pattern = {
          ...config.pattern,
          [value.pattern]: value,
        };
      } else {
        config[key] = value;
      }
    }
  }

  return { ...config };
}
