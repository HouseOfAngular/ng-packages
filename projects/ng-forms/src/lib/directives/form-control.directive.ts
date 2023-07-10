import {
  Directive,
  InjectFlags,
  Input,
  OnInit,
  ɵɵdirectiveInject as inject,
} from '@angular/core';
import {
  ControlContainer, FormArray, FormBuilder, FormControl, FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';



@Directive({
  standalone: true,
  providers: [ReactiveFormsModule, FormsModule],
})
export abstract class FormControlComponent<R> implements OnInit {
  protected readonly _fb = inject(FormBuilder);
  protected readonly _parent= inject(
    ControlContainer,
    InjectFlags.Host | InjectFlags.Optional | InjectFlags.SkipSelf
  );

  @Input({required: true, transform: () => })
  formControl!: FormControl<R>;

  @Input()
  formControlName?: string | number;

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit() {
    this._initForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _initForm() {
    if (this.formControl) return;

    this.formControl = this.createForm();

    const parentForm = this._parent?.control;

    if (
      parentForm instanceof FormArray &&
      typeof this.formControlName === 'number'
    ) {
      if (parentForm.controls[this.formControlName]) {
        this.formControl = parentForm.get([this.formControlName]) as FormControl<T>;
      } else {
        parentForm.insert(this.formControlName, this.formControl);
      }
    } else if (
      parentForm instanceof FormGroup &&
      typeof this.formControlName === 'string' &&
      this.formControlName
    ) {
      if (
        Object.prototype.hasOwnProperty.call(
          parentForm.controls,
          this.formControlName
        )
      ) {
        this.formControl = parentForm.get(this.formControlName) as FormControl<T>;
      } else {
        parentForm.addControl(this.formControlName, this.formControl);
      }
    }
  }

  protected createForm() {
      return this._fb.control<T>(null);
  }
}
