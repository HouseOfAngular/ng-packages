import { DestroyRef, Injectable, signal } from '@angular/core';
import {
  ApiErrorMessages,
  Parser,
  ValidationMessage,
  ValidationMessagesConfig,
} from '../resources';
import { KeyValue } from '@angular/common';
import { getInterpolableParams, getPropByPath } from '../utils';
import { mergeValidationMessagesConfigs } from '../utils/merge-validation-messages-configs.util';
import { distinctUntilChanged, Observable, isObservable } from 'rxjs';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ValidationMessagesService {
  private parser!: Parser;
  private validationMessagesFinalConfig: ValidationMessagesConfig<
    ValidationMessage | any
  > = {}; // types
  private templateMatcher = /{{(.*)}}+/g;

  _serverErrors = signal<ApiErrorMessages>(null);
  serverErrors = this._serverErrors.asReadonly();

  constructor(private _destroyRef: DestroyRef) {}

  serverErrorsValidator(apiErrors: ApiErrorMessages): ValidationErrors | null;
  serverErrorsValidator(
    apiErrors: Observable<ApiErrorMessages>
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
