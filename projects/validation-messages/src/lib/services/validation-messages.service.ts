import { Injectable } from '@angular/core';
import {
  Parser,
  ValidationMessagesConfig,
  ValidationMessagesEnhancedConfig,
} from '../resources';
import { KeyValue } from '@angular/common';
import { ValidationErrors } from '@angular/forms';
import {
  getInterpolableParams,
  getPropByPath,
  mergeValidationMessagesConfigs,
} from '../utils';

@Injectable({
  providedIn: 'root',
})
export class ValidationMessagesService {
  private parser!: Parser;
  private validationMessagesFinalConfig: ValidationMessagesEnhancedConfig = {};
  private templateMatcher = /{{(.*)}}+/g;
  private _materialErrorMatcher = false;

  get materialErrorMatcher(): boolean {
    return this._materialErrorMatcher;
  }

  getValidatorErrorMessage(
    validatorName: string,
    validatorValue: ValidationErrors[keyof ValidationErrors],
    localValidationMessagesConfig: ValidationMessagesConfig
  ): string {
    const validationMessages = mergeValidationMessagesConfigs(
      this.validationMessagesFinalConfig,
      localValidationMessagesConfig
    );

    if (!validationMessages[validatorName]) {
      return this.validatorNotSpecified(validatorName);
    }

    if (
      validatorName === 'pattern' &&
      typeof validatorValue.requiredPattern === 'string'
    ) {
      const message =
        validationMessages.pattern?.[validatorValue.requiredPattern] ||
        validationMessages.pattern?.['default'];
      if (!message) {
        return this.validatorNotSpecified(validatorName);
      }

      return this.interpolateMessageError(message.message, validatorValue);
    }

    const validatorMessage = validationMessages[validatorName];

    if (typeof validatorMessage === 'string') {
      return validatorMessage;
    }

    const message = this.interpolateMessageError(
      validatorMessage.message,
      validatorValue
    );

    return validatorMessage.validatorValue
      ? this.interpolateValue(
          message,
          validatorMessage.validatorValueParser
            ? validatorMessage.validatorValueParser(
                validatorValue[validatorMessage.validatorValue]
              )
            : validatorValue[validatorMessage.validatorValue]
        )
      : message;
  }

  setValidationMessages(
    validationMessagesConfig: ValidationMessagesConfig
  ): void {
    // Set validation errorMessages
    const config = mergeValidationMessagesConfigs({}, validationMessagesConfig);
    this.validationMessagesFinalConfig = { ...config };
  }

  setServerMessagesParser(serverMessageParser: Parser): void {
    this.parser = serverMessageParser;
  }

  useMaterialErrorMatcher(): void {
    this._materialErrorMatcher = true;
  }

  parseApiErrorMessage(message: string, params: any): string {
    if (this.parser) {
      return this.parser.parse(message, params);
    }

    return message;
  }

  setTemplateMatcher(templateMatcher: RegExp): void {
    if (templateMatcher instanceof RegExp) {
      this.templateMatcher = templateMatcher;
    } else {
      console.error('Template matcher must be a regex.');
    }
  }

  private interpolateMessageError(
    message: string,
    validatorValue: KeyValue<string, any>
  ) {
    // Interpolate non-default parameters with values from error object
    return getInterpolableParams(message).reduce((message, param) => {
      const prop = getPropByPath(validatorValue, param);
      if (prop === undefined) return message;
      return message.replaceAll(`{{${param}}}`, prop);
    }, message);
  }

  private interpolateValue(str: string, value: any): string {
    return str.replace(new RegExp(this.templateMatcher), value);
  }

  private validatorNotSpecified(validatorName: string): string {
    console.warn(
      `Validation message for ${validatorName} validator is not specified in this.`,
      `Did you called 'this.setValidationMessages()'?`
    );

    return '';
  }
}
