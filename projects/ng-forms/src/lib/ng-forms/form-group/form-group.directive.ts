import { AfterViewInit, Directive, Input, OnInit, inject } from '@angular/core';
import {
  ControlContainer,
  FormArray as NgFormArray,
  FormGroup as NgFormGroup,
} from '@angular/forms';
import { ReplaySubject } from 'rxjs';

import {
  FormArray,
  FormBuilder,
  NullableFormControl,
  NullableFormGroup,
} from '../types';
import { dynamicFormGroup } from '../utils/dynamic-form-group';

const OnInitSubject = Symbol('OnInitSubject');

@Directive()
export abstract class FormGroupComponent<T extends object = any>
  implements OnInit, AfterViewInit
{
  protected readonly _fb: FormBuilder;
  protected readonly _parent?: ControlContainer;
  protected get _parentOnlyFromHost() {
    return true;
  }

  private [OnInitSubject] = new ReplaySubject<true>(1);

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('formGroup')
  form!: NullableFormGroup<T>;

  @Input()
  formGroupName?: string | number;

  constructor() {
    this._fb = inject(FormBuilder);
    this._parent =
      inject(ControlContainer, {
        optional: true,
        skipSelf: true,
        host: this._parentOnlyFromHost,
      }) ?? undefined;

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

  getFormArray<K extends keyof T>(
    prop: K
  ): FormArray<T[K] extends any[] ? T[K][number] : never> {
    return this.form.get(prop as string) as any;
  }

  getFormGroup<K extends keyof T>(
    prop: K
  ): NullableFormGroup<T[K] extends object ? T[K] : never> {
    return this.form.get(prop as string) as any;
  }

  getFormControl<K extends keyof T>(prop: K): NullableFormControl<T[K]> {
    return this.form.get(prop as string) as any;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _initForm() {
    if (this.form) return;
    this.form = dynamicFormGroup(this.createForm()) as any;

    const parentForm = this._parent?.control;

    if (
      parentForm instanceof NgFormArray &&
      typeof this.formGroupName === 'number'
    ) {
      if (parentForm.controls[this.formGroupName]) {
        this.form = parentForm.get([
          this.formGroupName,
        ]) as NullableFormGroup<T>;
      } else {
        parentForm.insert(this.formGroupName, this.form);
      }
    } else if (
      parentForm instanceof NgFormGroup &&
      typeof this.formGroupName === 'string' &&
      this.formGroupName
    ) {
      if (parentForm.contains(this.formGroupName)) {
        this.form = parentForm.get(this.formGroupName) as NullableFormGroup<T>;
      } else {
        const parentDisabled = parentForm.disabled;
        parentForm.addControl(this.formGroupName, this.form);
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
