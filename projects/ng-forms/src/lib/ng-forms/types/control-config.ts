import {
  AbstractControlOptions,
  AsyncValidatorFn,
  ValidatorFn,
} from '@angular/forms';

import { AbstractControl } from './abstract-control';
import { ControlState } from './control-state';
import { FormGroup } from './form-group';

export declare type ControlConfig<T> =
  | FormGroup<T extends object ? T : never>
  | AbstractControl<T>
  | ControlState<T>
  | [
      ControlState<T>,
      (ValidatorFn | ValidatorFn[] | AbstractControlOptions)?,
      (AsyncValidatorFn | AsyncValidatorFn[])?
    ];
