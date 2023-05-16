import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ApiErrorMessage } from '../../../../projects/validation-messages/src';

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
        Validators.minLength(4),
        Validators.maxLength(255),
        Validators.required,
        Validators.pattern('^[a-zA-Z]*$'),
      ],
    ],
    number: ['', [Validators.min(10), Validators.max(99)]],
  });
  apiErrors: Array<ApiErrorMessage | string> = [
    { property: 'dodo', message: 'DoDuCheck' },
    { property: 'dodo', message: 'DoDuCheck' },
    'erroooor',
  ];
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
