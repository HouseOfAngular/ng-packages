import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  Host,
  Input,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import {
  AbstractControl,
  AbstractControlDirective,
  ControlContainer,
  FormControl,
} from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ApiErrorMessage,
  ValidationMessagesConfig,
} from '../../resources/interfaces';
import { ValidationMessagesService } from '../../services/validation-messages.service';
import {
  MatFormField,
  MatFormFieldControl,
} from '@angular/material/form-field';

type ApiErrorMessages =
  | Array<ApiErrorMessage | string>
  | ApiErrorMessage
  | string
  | null;

@Component({
  selector: 'ng-validation-messages',
  templateUrl: './validation-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationMessagesComponent
  implements OnInit, OnDestroy, DoCheck, AfterContentInit
{
  materialErrorMatcher = false;
  shownErrors: string[] = [];

  @Input() errorsMessages: ValidationMessagesConfig = {};
  @Input() control!: AbstractControl;
  @Input() controlName!: string;

  showServerErrors = false;
  parsedApiErrorMessages: string[] = [];
  valueChanges: Subscription | null = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    @Optional() @Host() protected host: MatFormField,
    private cd: ChangeDetectorRef,
    private validationMessagesService: ValidationMessagesService,
    private controlContainer: ControlContainer
  ) {
    this.unsubscribeAndClearValueChanges =
      this.unsubscribeAndClearValueChanges.bind(this);
    this.materialErrorMatcher = validationMessagesService.materialErrorMatcher;
  }

  private _multiple = false;

  get multiple(): boolean {
    return this._multiple;
  }

  @Input()
  set multiple(multiple: boolean) {
    this._multiple = multiple;
    this.updateErrorMessages();
  }

  private _apiErrorMessages: ApiErrorMessages = null;

  get apiErrorMessages(): ApiErrorMessages {
    return this._apiErrorMessages;
  }

  @Input()
  set apiErrorMessages(apiErrorMessages: ApiErrorMessages) {
    this.unsubscribeAndClearValueChanges();
    this._apiErrorMessages = apiErrorMessages;
    this.parseApiErrorMessages(this._apiErrorMessages);
    this.showServerErrors = true;

    if (this.control && apiErrorMessages) {
      this.control.setErrors({
        server: apiErrorMessages,
      });

      this.observeInputValueChanges();
    }
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

  observeInputValueChanges(): void {
    if (!this.valueChanges) {
      this.valueChanges = this.control.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(this.unsubscribeAndClearValueChanges);

      setTimeout(() => {
        this.cd.markForCheck();
      });
    }
  }

  parseApiErrorMessages(apiErrorMessages: ApiErrorMessages): void {
    if (!apiErrorMessages) {
      this.parsedApiErrorMessages = [];
      return;
    }

    const messages =
      apiErrorMessages instanceof Array
        ? [...apiErrorMessages]
        : [apiErrorMessages];
    this.parsedApiErrorMessages = messages.map(
      (message: ApiErrorMessage | string) =>
        message instanceof Object
          ? this.validationMessagesService.parseApiErrorMessage(
              message.message,
              message.property
            )
          : message
    );
  }

  ngOnInit(): void {
    this.readFormControlByControlName();
  }

  ngAfterContentInit(): void {
    this.readFormControlFromHost();

    this.control.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.cd.markForCheck());
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngDoCheck(): void {
    if (
      this.control &&
      ((this.control.invalid && this.control.touched) ||
        (!this.control.invalid && this.shownErrors.length > 0))
    ) {
      this.updateErrorMessages();
      this.cd.markForCheck();
    }
  }

  private updateErrorMessages(): void {
    this.shownErrors = [];

    if (!this.control || !this.control.errors) {
      return;
    }

    const controlErrors = this.control.errors;
    for (const propertyName in controlErrors) {
      if (!this.multiple && this.shownErrors.length === 1) {
        break;
      }

      if (controlErrors[propertyName] && propertyName !== 'server') {
        this.shownErrors.push(
          this.validationMessagesService.getValidatorErrorMessage(
            propertyName,
            controlErrors[propertyName],
            this.errorsMessages
          )
        );
      }
    }
  }

  private unsubscribeAndClearValueChanges(): void {
    if (this.control) {
      this.control.setErrors({});
      this.control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }

    if (this.valueChanges && !this.valueChanges.closed) {
      this.valueChanges.unsubscribe();
    }

    this.showServerErrors = false;
    this.valueChanges = null;
  }

  private readFormControlByControlName(): void {
    if (this.controlName === undefined) {
      return;
    }

    const control = this.controlContainer.control?.get(this.controlName);

    if (!(control instanceof FormControl)) {
      return;
    }

    this.control = control;
  }

  private readFormControlFromHost(): void {
    if (this.control !== undefined) {
      return;
    }

    if (!(this.matInputControl instanceof FormControl)) {
      return;
    }

    this.control = this.matInputControl;
  }
}
