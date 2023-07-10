import {AfterViewInit, Directive, inject, Input, OnInit} from '@angular/core';
import { AbstractControl, ControlContainer, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {ReplaySubject} from 'rxjs';

import {dynamicFormGroup} from '../utils/dynamic-form-group';

const OnInitSubject = Symbol('OnInitSubject');

@Directive()
export abstract class FormGroupComponent<T extends {
  [K in keyof T]: AbstractControl<any>;
} = any>
  implements OnInit, AfterViewInit
{
  protected readonly _fb = inject(FormBuilder);
  protected readonly _parent =
  inject(ControlContainer, {
    optional: true,
    skipSelf: true,
    host: this._parentOnlyFromHost,
  });
  protected get _parentOnlyFromHost() {
    return true;
  }

  private [OnInitSubject] = new ReplaySubject<true>(1);

  @Input()
  formGroup!: FormGroup<T>;

  @Input()
  formGroupName?: string | number;

  constructor() {
    this.onFormInit$.subscribe(() => this.initForm());
  }

  public get onFormInit$() {
    return this[OnInitSubject].asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit() {
    this._initForm();
  }

  ngAfterViewInit() {
    this[OnInitSubject].next(true);
    this[OnInitSubject].complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _initForm() {
    if (this.formGroup) return;
    this.formGroup = dynamicFormGroup(this.createForm());

    const parentForm = this._parent?.control;

    if (
      parentForm instanceof FormArray &&
      typeof this.formGroupName === 'number'
    ) {
      if (parentForm.controls[this.formGroupName]) {
        this.formGroup = parentForm.get([
          this.formGroupName,
        ]) as FormGroup<T>;
      } else {
        parentForm.insert(this.formGroupName, this.formGroup);
      }
    } else if (
      parentForm instanceof FormGroup &&
      typeof this.formGroupName === 'string' &&
      this.formGroupName
    ) {
      if (parentForm.contains(this.formGroupName)) {
        this.formGroup = parentForm.get(this.formGroupName) as FormGroup<T>;
      } else {
        const parentDisabled = parentForm.disabled;
        parentForm.addControl(this.formGroupName, this.formGroup);
        if (parentDisabled) {
          parentForm.disable({ emitEvent: false });
        }
      }
    }
  }

  protected createForm() {
    return this._fb.group<any>({});
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected initForm(): void {}
}
