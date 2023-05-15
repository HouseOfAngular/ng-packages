import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ApiErrorMessage } from '../../../../projects/validation-messages/src';

const validationConfig = {
  nameMinLength: 4,
  nameMaxLength: 255,
  commentMaxLength: 2048,
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  form = this.fb.group({
    email: ['', [Validators.email, this.emailDomainValidator]],
    name: [
      '',
      [
        Validators.minLength(validationConfig.nameMinLength),
        Validators.maxLength(validationConfig.nameMaxLength),
        Validators.required,
        Validators.pattern('[a-zA-Z]*'),
      ],
    ],
    comment: ['', [Validators.maxLength(validationConfig.commentMaxLength)]],
  });
  apiErrors: Array<ApiErrorMessage | string> = [
    { property: 'dodo', message: 'DoDuCheck' },
    { property: 'dodo', message: 'DoDuCheck' },
    'erroooor',
  ];
  apiError: ApiErrorMessage = { property: 'dodo', message: 'DoDuCheck' };
  multiple = false;

  constructor(private fb: FormBuilder) {}

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
}
