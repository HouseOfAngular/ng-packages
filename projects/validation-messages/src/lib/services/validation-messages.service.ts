import { DestroyRef, Injectable, signal } from '@angular/core';
import {
  ApiErrorMessages,
  Parser,
  ValidationMessagesConfig,
  ValidationMessagesEnhancedConfig,
} from '../resources/index.js';
import { KeyValue } from '@angular/common';
import {
  getInterpolableParams,
  getPropByPath,
  mergeValidationMessagesConfigs,
} from '../utils';
import { distinctUntilChanged, Observable, isObservable } from 'rxjs';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ValidationMessagesService {
  private parser!: Parser;
  private validationMessagesFinalConfig: ValidationMessagesEnhancedConfig = {};
  private templateMatcher = /{{(.*)}}+/g;

  _serverErrors = signal<ApiErrorMessages>(null);
  serverErrors = this._serverErrors.asReadonly();

  constructor(private _destroyRef: DestroyRef) {}

  serverErrorsValidator(
    apiErrors: ApiErrorMessages | Observable<ApiErrorMessages>
  ): ValidationErrors | null;
  serverErrorsValidator(
    apiErrors: Observable<ApiErrorMessages> | ApiErrorMessages
  ) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!isObservable(apiErrors)) {
        this._setFormControlErrors(control, apiErrors);
        return apiErrors ? { server: apiErrors } : null;
      }

      let errors: ApiErrorMessages = null;

      apiErrors
        .pipe(distinctUntilChanged(), takeUntilDestroyed(this._destroyRef))
        .subscribe((apiErrors) => {
          errors = apiErrors;
          this._setFormControlErrors(control, errors);
          this._serverErrors.set(errors);
        });
      return errors ? { server: errors } : null;
    };
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

  private _setFormControlErrors(
    control: AbstractControl,
    errors: ApiErrorMessages
  ) {
    if (errors) {
      control.setErrors({ ...control.errors, server: errors });
    } else {
      const nonServerErrors = { ...control.errors };
      delete nonServerErrors['server'];
      control.setErrors(
        Object.keys(nonServerErrors).length > 0 ? nonServerErrors : null
      );
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
