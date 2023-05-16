import { Injectable } from '@angular/core';
import {
  Parser,
  ValidationMessage,
  ValidationMessagesConfig,
} from '../resources';
import { KeyValue } from '@angular/common';
import { getInterpolableParams, getPropByPath } from '../utils';
import { mergeValidationMessagesConfigs } from '../utils/merge-validation-messages-configs.util';

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
    validatorValue: any = {},
    localValidationMessagesConfig: ValidationMessagesConfig = {}
  ): string {
    // types
    const validationMessages = mergeValidationMessagesConfigs(
      this.validationMessagesFinalConfig,
      localValidationMessagesConfig
    ) as { [p: string]: any };

    const validatorMessage = validationMessages[validatorName];
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

  private validatorNotSpecified(validatorName: string): string {
    console.warn(
      `Validation message for ${validatorName} validator is not specified in this.`,
      `Did you called 'this.setValidationMessages()'?`
    );

    return '';
  }
}
