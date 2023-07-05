import { Injectable } from '@angular/core';
import {
  AbstractControlOptions,
  AsyncValidatorFn,
  UntypedFormBuilder as NgFormBuilder,
  ValidatorFn,
} from '@angular/forms';

import { ControlConfig } from './control-config';
import { ControlState } from './control-state';
import { FormArray } from './form-array';
import { FormControl } from './form-control';
import { FormGroup } from './form-group';

export interface FormBuilder {
  array<Item = any>(
    controlsConfig: ControlConfig<Item>[],
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ): FormArray<Item>;

  control<T = any>(
    formState: ControlState<T>,
    validatorOrOpts?:
      | ValidatorFn
      | ValidatorFn[]
      | AbstractControlOptions
      | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ): FormControl<T>;

  group<T extends Record<string, any> = any>(
    controlsConfig: {
      [key in keyof T]: ControlConfig<T[key]>;
    },
    options?:
      | AbstractControlOptions
      | {
          [key: string]: any;
        }
      | null
  ): FormGroup<T>;
}

@Injectable({ providedIn: 'root' })
export class FormBuilder extends NgFormBuilder {}
