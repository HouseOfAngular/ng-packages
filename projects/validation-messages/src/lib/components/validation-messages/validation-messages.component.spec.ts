import {
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ValidationMessagesModule,
  ValidationMessagesService,
} from 'validation-messages';
import { createHostFactory } from '@ngneat/spectator/jest';
import { MatInputModule } from '@angular/material/input';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatDatepickerInputHarness } from '@angular/material/datepicker/testing';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

const selectors = {
  textInput: '[data-cy="text-input"]',
  numberInput: '[data-cy="number-input"]',
  requiredInput: '[data-cy="required-input"]',
  minMaxLengthInput: '[data-cy="min-max-length-input"]',
  emailInput: '[data-cy="email-input"]',
  error: 'ng-validation-messages',
};

describe('ValidationMessagesComponent', () => {
  const errorMessages = {
    email: 'Invalid e-mail address.',
    matDatepickerMax: 'The date can not be later than {{value}}.',
    matDatepickerMin: 'The date can not be earlier than {{value}}.',
    max: 'This field value should be lower than {{value}}.',
    maxlength: 'This field should have maximum {{value}} characters.',
    min: 'This field value should be greater than {{value}}.',
    minlength: 'This field should contain at least {{value}} characters.',
    required: 'This field is required.',
    letterPattern: {
      message: 'patternIssue {{requiredPattern}}',
      validatorValue: 'requiredPattern',
      pattern: '^[a-zA-Z]*$',
    },
    pattern: 'first letter should be capital',
  };
  const minDate = new Date('2023-07-17');
  const maxDate = new Date('2023-07-30');

  const createHost = createHostFactory({
    // use any component from the template, for some reason it doesn't detect ng-validation-messages component
    component: FormGroupDirective,
    imports: [
      ValidationMessagesModule,
      ReactiveFormsModule,
      MatInputModule,
      MatDatepickerModule,
      MatNativeDateModule,
    ],
  });

  const testSetup = () => {
    const fb = new FormBuilder();
    const spectator = createHost(
      `
<form [formGroup]="form">
  <mat-form-field>
    <mat-label>Email</mat-label>
    <input matInput type="email" data-cy='email-input' formControlName="email" />
    <mat-error>
      <ng-validation-messages
      ></ng-validation-messages>
    </mat-error>
  </mat-form-field>
  <mat-form-field>
    <input matInput data-cy='text-input' formControlName='text'>
    <mat-error>
      <ng-validation-messages></ng-validation-messages>
    </mat-error>
  </mat-form-field>
  <mat-form-field>
    <input matInput data-cy='required-input' formControlName='required'>
    <mat-error>
      <ng-validation-messages></ng-validation-messages>
    </mat-error>
  </mat-form-field>
  <mat-form-field>
    <input matInput data-cy='min-max-length-input' formControlName='minMaxLength'>
    <mat-error>
      <ng-validation-messages></ng-validation-messages>
    </mat-error>
  </mat-form-field>
  <mat-form-field>
    <input matInput type='number' data-cy='number-input' formControlName='number'>
    <mat-error>
      <ng-validation-messages></ng-validation-messages>
    </mat-error>
  </mat-form-field>
  <mat-form-field>
    <input matInput [matDatepicker]="seStDt" [min]="minDate" [max]="maxDate" formControlName="date">
    <mat-datepicker #seStDt></mat-datepicker>
    <mat-error>
      <ng-validation-messages></ng-validation-messages>
    </mat-error>
</mat-form-field>
</form>`,
      {
        hostProps: {
          form: fb.group({
            text: [
              '',
              [
                Validators.pattern('^[a-zA-Z]*$'),
                Validators.pattern('^[A-Z].*'),
              ],
            ],
            number: [null, [Validators.min(0), Validators.max(10)]],
            email: ['', Validators.email],
            required: ['', Validators.required],
            minMaxLength: [
              '',
              [Validators.minLength(3), Validators.maxLength(5)],
            ],
            date: [''],
          }),
          minDate,
          maxDate,
        },
      }
    );

    spectator
      .inject(ValidationMessagesService)
      .setValidationMessages(errorMessages);
    return {
      spectator,
      loader: TestbedHarnessEnvironment.loader(spectator.fixture),
    };
  };

  describe('name control', () => {
    it('should not have error if only letters are typed', () => {
      // arrange
      const { spectator } = testSetup();

      // act
      spectator.typeInElement('Dominik', selectors.textInput);
      spectator.blur(selectors.textInput);

      // assert
      expect(selectors.error).not.toExist();
    });

    it('should display an error when anything other than letter is typed', async () => {
      // arrange
      const { spectator } = testSetup();

      // act
      spectator.typeInElement('ab12dw', selectors.textInput);
      spectator.blur(selectors.textInput);

      // assert
      expect(selectors.error).toExist();
    });

    it('should display specific error for the letter pattern', async () => {
      // arrange
      const { spectator } = testSetup();

      // act
      spectator.typeInElement('Ab12dw', selectors.textInput);
      spectator.blur(selectors.textInput);

      // assert
      expect(selectors.error).toContainText('patternIssue ^[a-zA-Z]*$');
    });

    it('should display specific error for the capital letter pattern', async () => {
      // arrange
      const { spectator } = testSetup();

      // act
      spectator.typeInElement('abc', selectors.textInput);
      spectator.blur(selectors.textInput);

      // assert
      expect(selectors.error).toContainText(errorMessages.pattern);
    });
  });

  describe('email control', () => {
    it('should not have error when valid email is typed', () => {
      // arrange
      const { spectator } = testSetup();

      // act
      spectator.typeInElement(
        'dominik.kalinowski@houseofangular.io',
        selectors.emailInput
      );
      spectator.blur(selectors.emailInput);

      // assert
      expect(selectors.error).not.toExist();
    });

    it('should display email error when something else is typed', () => {
      // arrange
      const { spectator } = testSetup();

      // act
      spectator.typeInElement('somethingelse@:D ', selectors.emailInput);
      spectator.blur(selectors.emailInput);

      // assert
      expect(selectors.error).toContainText(errorMessages.email);
    });
  });

  describe('number control', () => {
    it('should not have error when a number in specified range is typed', () => {
      // arrange
      const { spectator } = testSetup();

      // act
      spectator.typeInElement('5', selectors.numberInput);
      spectator.blur(selectors.numberInput);

      // assert
      expect(selectors.error).not.toExist();
    });

    it('should have min error when typed number is lower than min', () => {
      // arrange
      const { spectator } = testSetup();

      // act
      spectator.typeInElement('-4', selectors.numberInput);
      spectator.blur(selectors.numberInput);

      // assert
      const service = spectator.inject(ValidationMessagesService);
      expect(selectors.error).toContainText(
        service['interpolateMessageError'](errorMessages.min, {
          key: 'value',
          value: 0,
        })
      );
    });

    it('should have max error when typed number is grater than max', () => {
      // arrange
      const { spectator } = testSetup();

      // act
      spectator.typeInElement('14', selectors.numberInput);
      spectator.blur(selectors.numberInput);

      // assert
      const service = spectator.inject(ValidationMessagesService);
      expect(selectors.error).toContainText(
        service['interpolateMessageError'](errorMessages.max, {
          key: 'value',
          value: 10,
        })
      );
    });
  });

  describe('required control', () => {
    it('should not have error when anything is typed', () => {
      // arrange
      const { spectator } = testSetup();

      // act
      spectator.typeInElement('18L', selectors.requiredInput);
      spectator.blur(selectors.requiredInput);

      // assert
      expect(selectors.error).not.toExist();
    });

    it('should have error when nothing is typed', () => {
      // arrange
      const { spectator } = testSetup();

      // act
      spectator.typeInElement('', selectors.requiredInput);
      spectator.blur(selectors.requiredInput);

      // assert
      expect(selectors.error).toContainText(errorMessages.required);
    });
  });

  describe('length control', () => {
    it('should not have error when text of specific length is typed', () => {
      // arrange
      const { spectator } = testSetup();

      // act
      spectator.typeInElement('1234', selectors.minMaxLengthInput);
      spectator.blur(selectors.minMaxLengthInput);

      // assert
      expect(selectors.error).not.toExist();
    });

    it('should have minlength error when too short text is typed', () => {
      // arrange
      const { spectator } = testSetup();

      // act
      spectator.typeInElement('12', selectors.minMaxLengthInput);
      spectator.blur(selectors.minMaxLengthInput);

      // assert
      const service = spectator.inject(ValidationMessagesService);
      expect(selectors.error).toContainText(
        service['interpolateMessageError'](errorMessages.minlength, {
          key: 'value',
          value: 3,
        })
      );
    });

    it('should have maxlength error when too short text is typed', () => {
      // arrange
      const { spectator } = testSetup();

      // act
      spectator.typeInElement('123456', selectors.minMaxLengthInput);
      spectator.blur(selectors.minMaxLengthInput);

      // assert
      const service = spectator.inject(ValidationMessagesService);
      expect(selectors.error).toContainText(
        service['interpolateMessageError'](errorMessages.maxlength, {
          key: 'value',
          value: 5,
        })
      );
    });
  });

  describe('date control', () => {
    it('should not have error when date in specified range is selected', async () => {
      // arrange
      const { loader } = testSetup();
      const dateHarness = await loader.getHarness(MatDatepickerInputHarness);

      // act
      await dateHarness.openCalendar();
      await dateHarness.setValue('2023-07-19');
      await dateHarness.blur();

      // assert
      expect(selectors.error).not.toExist();
    });

    it('should have error when date in after the maxDate', async () => {
      // arrange
      const { loader } = testSetup();
      const dateHarness = await loader.getHarness(MatDatepickerInputHarness);

      // act
      await dateHarness.openCalendar();
      await dateHarness.setValue('2024-07-19');
      await dateHarness.blur();

      // assert
      expect(selectors.error).toContainText('The date can not be later than');
      /*  TODO: should allow to interpolate error message
      const service = spectator.inject(ValidationMessagesService);
      expect(selectors.error).toContainText(
        service['interpolateMessageError'](errorMessages.matDatepickerMax, {
          key: 'value',
          value: maxDate.toISOString(),
        })
      );
       */
    });

    it('should have error when date in before the minDate', async () => {
      // arrange
      const { loader } = testSetup();
      const dateHarness = await loader.getHarness(MatDatepickerInputHarness);

      // act
      await dateHarness.openCalendar();
      await dateHarness.setValue('2023-03-15');
      await dateHarness.blur();

      // assert
      expect(selectors.error).toContainText('The date can not be earlier than');
      /*  TODO: should allow to interpolate error message
      const service = spectator.inject(ValidationMessagesService);
      expect(selectors.error).toContainText(
        service['interpolateMessageError'](errorMessages.matDatepickerMax, {
          key: 'value',
          value: maxDate.toISOString(),
        })
      );
       */
    });
  });
});
