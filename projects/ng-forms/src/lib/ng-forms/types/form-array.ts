import { FormArray as NgFormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { AbstractControl } from './abstract-control';

export interface FormArray<Item> extends NgFormArray {
  controls: AbstractControl<Item>[];
  getRawValue(): Item[];
  insert(
    index: number,
    control: AbstractControl<Item>,
    options?: {
      emitEvent?: boolean;
    }
  ): void;

  push(
    control: AbstractControl<Item>,
    options?: {
      emitEvent?: boolean;
    }
  ): void;

  setControl(
    index: number,
    control: AbstractControl<Item>,
    options?: {
      emitEvent?: boolean;
    }
  ): void;

  readonly value: Item[];
  readonly valueChanges: Observable<Item[]>;
  at(index: number): AbstractControl<Item>;

  removeAt(
    index: number,
    options?: {
      emitEvent?: boolean;
    }
  ): void;
  clear(options?: { emitEvent?: boolean }): void;
  get length(): number;
}
