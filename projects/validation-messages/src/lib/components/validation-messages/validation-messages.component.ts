import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ControlContainer, FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiErrorMessage } from '../../resources/interfaces';
import { ValidationMessagesService } from '../../services/validation-messages.service';

@Component({
  selector: 'ng-validation-messages',
  templateUrl: './validation-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidationMessagesComponent implements OnInit, OnDestroy, DoCheck {
  materialErrorMatcher = false;
  errorMessages: string[] = [];
  @Input()
  control!: FormControl;
  @Input()
  controlName!: string;
  showServerErrors = false;
  parsedApiErrorMessages: string[] = [];
  valueChanges: Subscription | null = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
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

  private _apiErrorMessages:
    | Array<ApiErrorMessage | string>
    | ApiErrorMessage
    | string
    | null = null;

  get apiErrorMessages():
    | Array<ApiErrorMessage | string>
    | ApiErrorMessage
    | string
    | null {
    return this._apiErrorMessages;
  }

  @Input()
  set apiErrorMessages(
    apiErrorMessages:
      | Array<ApiErrorMessage | string>
      | ApiErrorMessage
      | string
      | null
  ) {
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

  parseApiErrorMessages(
    apiErrorMessages:
      | Array<ApiErrorMessage | string>
      | ApiErrorMessage
      | string
      | null
  ): void {
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
    this.readFormControl();

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
        (!this.control.invalid && this.errorMessages.length > 0))
    ) {
      this.updateErrorMessages();
    }
  }

  private updateErrorMessages(): void {
    this.errorMessages = [];

    if (!this.control || !this.control.errors) {
      return;
    }

    const controlErrors = this.control.errors;
    for (const propertyName in controlErrors) {
      if (!this.multiple && this.errorMessages.length === 1) {
        break;
      }

      if (controlErrors[propertyName] && propertyName !== 'server') {
        this.errorMessages.push(
          this.validationMessagesService.getValidatorErrorMessage(
            propertyName,
            controlErrors[propertyName]
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

  private readFormControl() {
    if (this.controlName === undefined) {
      return;
    }
    const control = this.controlContainer.control?.get(this.controlName);
    if (!(control instanceof FormControl)) {
      return;
    }
    this.control = control as FormControl;
  }
}
