import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  DestroyRef,
  Host,
  Injector,
  Input,
  OnInit,
  Optional,
  Signal,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  AbstractControlDirective,
  ControlContainer,
  FormControl,
} from '@angular/forms';

import {
  ApiErrorMessage,
  ApiErrorMessages,
  ValidationMessagesConfig,
} from '../../resources/index.js';
import { ValidationMessagesService } from '../../services/index.js';
import {
  MatFormField,
  MatFormFieldControl,
} from '@angular/material/form-field';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, fromEvent } from 'rxjs';

@Component({
  selector: 'ng-validation-messages',
  templateUrl: './validation-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationMessagesComponent implements OnInit, AfterContentInit {
  @Input() errorsMessages: ValidationMessagesConfig = {};
  @Input() control?: AbstractControl;
  @Input() controlName?: string;
  @Input()
  set multiple(multiple: boolean) {
    this._multiple.set(multiple);
  }

  shownErrors = computed(() => {
    this._serverErrors;
    this._controlSig();
    if (this.control?.invalid) {
      return this._defineErrorsToBeShown();
    }
    return [];
  });

  private _controlSig!: Signal<undefined | AbstractControl>;
  private _multiple = signal(false);
  constructor(
    @Host() @Optional() protected host: MatFormField,
    private _validationMessagesService: ValidationMessagesService,
    @Optional() private _controlContainer: ControlContainer,
    private _destroyRef: DestroyRef,
    private _injector: Injector,
    private _cdr: ChangeDetectorRef
  ) {}

  get _serverErrors() {
    return this._validationMessagesService.serverErrors();
  }

  get matInputControl(): AbstractControl | AbstractControlDirective | null {
    if (this.matInputRef?.ngControl) {
      return this.matInputRef.ngControl.control || this.matInputRef.ngControl;
    }
    return null;
  }

  get matInputRef(): MatFormFieldControl<any> {
    return this.host._control;
  }

  get isControlDirtyOrTouched() {
    return this.control && (this.control.dirty || this.control.touched);
  }

  ngOnInit(): void {
    this._readFormControlByControlName();
  }

  ngAfterContentInit(): void {
    this._readFormControlFromHost();
    this._listenToFormChanges();
    this._listenToControlOnBlur();
  }

  private _listenToControlOnBlur() {
    if (!this.host || !this.matInputRef) {
      return;
    }

    const onBlur$ = fromEvent(
      (this.matInputRef as any)?._elementRef.nativeElement,
      'blur'
    );

    onBlur$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this._cdr.markForCheck();
    });
  }

  private _parseApiErrorMessages(apiErrorMessages: ApiErrorMessages): string[] {
    if (!apiErrorMessages) {
      return [];
    }

    const messages =
      apiErrorMessages instanceof Array
        ? [...apiErrorMessages]
        : [apiErrorMessages];

    return messages.map((message: ApiErrorMessage | string) =>
      message instanceof Object
        ? this._validationMessagesService.parseApiErrorMessage(
            message.message,
            message.property
          )
        : message
    );
  }

  private _defineErrorsToBeShown() {
    if (!this.control) {
      return;
    }

    const errorMessages: string[] = [];

    for (const [propertyName, value] of Object.entries(this.control.errors!)) {
      if (!value) {
        continue;
      }
      if (propertyName !== 'server') {
        const errorMessage =
          this._validationMessagesService.getValidatorErrorMessage(
            propertyName,
            value,
            this.errorsMessages
          );
        errorMessages.push(errorMessage);
      } else {
        errorMessages.push(...this._parseApiErrorMessages(value));
      }
    }

    if (!this._multiple() && errorMessages.length) {
      return [errorMessages[0]];
    }
    return errorMessages || [];
  }

  private _listenToFormChanges(): void {
    if (!this.control) {
      return;
    }

    const valueChanges$ = this.control.valueChanges.pipe(
      filter(() => !!this.control?.invalid),
      takeUntilDestroyed(this._destroyRef)
    );

    this._controlSig = toSignal(valueChanges$, {
      injector: this._injector,
      initialValue: this.control,
    });
  }

  private _readFormControlByControlName(): void {
    if (this.controlName === undefined) {
      return;
    }

    const control = this._controlContainer?.control?.get(this.controlName);

    if (!(control instanceof FormControl)) {
      return;
    }

    this.control = control as FormControl;
  }

  private _readFormControlFromHost(): void {
    if (this.control !== undefined) {
      return;
    }

    if (!(this.matInputControl instanceof FormControl)) {
      return;
    }

    this.control = this.matInputControl;
  }
}
