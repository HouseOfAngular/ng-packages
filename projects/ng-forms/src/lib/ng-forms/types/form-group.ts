import { AbstractControl as NgAbstractControl } from '@angular/forms';
import { AbstractControl } from './abstract-control';
import { WithNullableFirstOrderProperties } from './with-nullable-properties';

export interface FormGroup<T extends Record<string, any> = any>
  extends AbstractControl<T> {
  controls: {
    [key in keyof T]: AbstractControl<T[key], T>;
  };

  addControl<K extends keyof T>(
    name: Extract<keyof T, string>,
    control: NgAbstractControl | AbstractControl<T[K]>,
    options?: {
      emitEvent?: boolean;
    }
  ): void;

  contains(controlName: keyof T): boolean;

  getRawValue(): T;

  patchValue(
    value: Partial<T>,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void;

  registerControl<K extends keyof T>(
    name: Extract<keyof T, string>,
    control: NgAbstractControl | AbstractControl<T[K]>
  ): NgAbstractControl;

  removeControl(
    name: keyof T,
    options?: {
      emitEvent?: boolean;
    }
  ): void;

  reset(
    value: T,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void;
  setControl<K extends keyof T>(
    name: Extract<keyof T, string>,
    control: NgAbstractControl | AbstractControl<T[K]>,
    options?: {
      emitEvent?: boolean;
    }
  ): void;

  setValue<K extends keyof T>(
    value: T,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void;
}

/**
 * An interface for the form user-form that should be used if form is being reset without default value
 */
export type NullableFormGroup<T extends Record<string, any> = any> = FormGroup<
  WithNullableFirstOrderProperties<T>
> & {
  reset(
    value?: WithNullableFirstOrderProperties<T>,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void;
};
