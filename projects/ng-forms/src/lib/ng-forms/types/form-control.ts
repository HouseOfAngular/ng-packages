/* eslint-disable @typescript-eslint/ban-types */
import { FormControl as NgFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractControl } from './abstract-control';
import { ControlState } from './control-state';

export interface FormControl<T> extends NgFormControl {
  readonly value: T;

  readonly valueChanges: Observable<T>;

  get(path: string): AbstractControl<T> | null;

  getError(errorCode: string, path?: string): any;

  patchValue(
    value: null | T | Partial<T>,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  ): void;

  registerOnChange(fn: Function): void;

  registerOnDisabledChange(fn: (isDisabled: boolean) => void): void;

  reset(
    formState: ControlState<T>,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void;

  setValue(
    value: null | T,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  ): void;
}

/**
 * An interface for the form control that should be used if control is being reset without default value
 */
export type NullableFormControl<T> = FormControl<T | null> & {
  reset(
    formState?: ControlState<T | null>,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void;
};

export class FormControl<T> extends NgFormControl {}
