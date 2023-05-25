import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  ApiErrorMessage,
  ValidationMessagesService,
} from '../../../../projects/validation-messages/src';
import { BehaviorSubject, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  apiErrors: Array<ApiErrorMessage | string> = [
    { property: 'dodo', message: 'DoDuCheck' },
    { property: 'dodo', message: 'DoDuCheck' },
    'erroooor',
  ];
  private _serverErrors = new BehaviorSubject<any>(this.apiErrors);
  serverErrors$ = this._serverErrors.asObservable();
  form = this.fb.group({
    email: [
      '',
      [Validators.email, this.emailDomainValidator, Validators.required],
    ],
    name: [
      '',
      [
        Validators.minLength(4),
        Validators.maxLength(255),
        Validators.required,
        Validators.pattern('^[a-zA-Z]*$'),
        this._validationService.serverErrorsValidator(this.apiErrors),
      ],
    ],
    number: [
      '',
      [
        Validators.min(10),
        Validators.max(99),
        this._validationService.serverErrorsValidator(this.serverErrors$),
      ],
    ],
  });

  multiple = false;

  constructor(
    private fb: FormBuilder,
    private _validationService: ValidationMessagesService
  ) {}

  emailDomainValidator(control: FormControl) {
    const email = control.value;
    if (email && email.indexOf('@') !== -1) {
      const [, domain] = email.split('@');
      if (domain !== 'valueadd.pl') {
        return {
          emailDomain: {
            parsedDomain: domain,
          },
        };
      }
    }
    return null;
  }
  addServerError() {
    this._serverErrors.next([...this.apiErrors, 'Next error']);
  }

  clearServerErrors() {
    this._serverErrors.next(undefined);
  }
}
