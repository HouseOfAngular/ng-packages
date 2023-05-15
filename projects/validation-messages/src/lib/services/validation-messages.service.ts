import { Injectable } from '@angular/core';
import {
  angularValidatorsWithValueMap,
  Parser,
  ValidationMessage,
  ValidationMessagesConfig,
} from '../resources';
import { KeyValue } from '@angular/common';
import { getInterpolableParams, getPropByPath } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class ValidationMessagesService {
  private parser!: Parser;
  private validationMessagesFinalConfig: ValidationMessagesConfig<
    ValidationMessage | any
  > = {}; // types
  private templateMatcher = /{{(.*)}}+/g;
  private _materialErrorMatcher = false;

  get materialErrorMatcher(): boolean {
    return this._materialErrorMatcher;
  }

  getValidatorErrorMessage(
    validatorName: string,
    validatorValue: any = {}
  ): string {
    // types
    const validatorMessage = this.validationMessagesFinalConfig[validatorName];
    if (!validatorMessage) {
      return this.validatorNotSpecified(validatorName);
    }

    if (validatorName === 'pattern') {
      const message = validatorMessage[validatorValue.requiredPattern];
      if (!message) {
        return this.validatorNotSpecified(validatorName);
      }

      return this.interpolateMessageErrors(message.message, validatorValue);
    }

    const message = this.interpolateMessageErrors(
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
    const validationMessagesFinalConfig: any = {};

    // Set validation errorMessages
    for (const key in validationMessagesConfig) {
      if (typeof validationMessagesConfig[key] === 'string') {
        validationMessagesFinalConfig[key] = {
          message: validationMessagesConfig[key],
          validatorValue: this.getValidatorValue(key),
        };
      } else {
        const validator = validationMessagesConfig[key] as ValidationMessage;
        if (validator.pattern) {
          validationMessagesFinalConfig['pattern'] = {
            ...validationMessagesFinalConfig['pattern'],
            [validator.pattern]: validator,
          };
        } else {
          validationMessagesFinalConfig[key] = validator;
        }
      }
    }

    this.validationMessagesFinalConfig = { ...validationMessagesFinalConfig };
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

  private interpolateMessageErrors(
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

  private getValidatorValue(key: string): string {
    return (angularValidatorsWithValueMap as any)[key] || key; // types
  }

  private validatorNotSpecified(validatorName: string): string {
    console.warn(
      `Validation message for ${validatorName} validator is not specified in this.`,
      `Did you called 'this.setValidationMessages()'?`
    );

    return '';
  }
}
