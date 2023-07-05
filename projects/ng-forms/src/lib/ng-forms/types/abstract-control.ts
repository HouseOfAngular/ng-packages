import { AbstractControl as NgAbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ControlState } from './control-state';
export interface AbstractControl<T, Entity = any> extends NgAbstractControl {
  readonly value: T;

  readonly valueChanges: Observable<T>;

  get<T, K extends keyof Entity>(
    path: Array<Extract<K, string> | number> | Extract<K, string>
  ): AbstractControl<Entity[K]> | null;

  setValue(
    value: null | T,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  ): void;

  patchValue(
    value: null | T | Partial<T>,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
      emitModelToViewChange?: boolean;
      emitViewToModelChange?: boolean;
    }
  ): void;

  reset(
    formState?: ControlState<T>,
    options?: {
      onlySelf?: boolean;
      emitEvent?: boolean;
    }
  ): void;

  getError(
    errorCode: string,
    path?:
      | Array<Extract<keyof Entity, string> | number>
      | Extract<keyof Entity, string>
  ): any;
}
