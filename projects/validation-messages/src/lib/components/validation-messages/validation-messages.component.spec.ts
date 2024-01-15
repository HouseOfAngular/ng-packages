import { ControlContainer, FormControl, Validators } from '@angular/forms';
import { ValidationMessagesComponent } from './validation-messages.component.js';
import { MatFormField } from '@angular/material/form-field';
import { createHostFactory } from '@ngneat/spectator/jest';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  ApiErrorMessages,
  ValidationMessagesConfig,
  ValidationMessagesService,
} from 'validation-messages';
import { selectors } from '../../resources/const/test-selectors.js';

interface TestConfig {
  control?: FormControl;
  controlName?: string;
  errorsMessages?: ValidationMessagesConfig;
  apiErrorMessages?: ApiErrorMessages;
  multiple?: boolean;
}

describe('ValidationMessagesComponent', () => {
  const createHost = createHostFactory({
    component: ValidationMessagesComponent,
    componentProviders: [MatFormField],
    providers: [ValidationMessagesService, ControlContainer],
  });

  const hostSetup = (config: TestConfig) => {
    const spectator = createHost(
      `<ng-validation-messages
    [control]="control"
    [controlName]="controlName"
    [errorsMessages]="errorMessages"
    [multiple]="multiple"></ng-validation-messages>`,
      {
        hostProps: {
          control: config.control,
          controlName: config.controlName,
          errorsMessages: config.errorsMessages,
          apiErrorMessages: config.apiErrorMessages,
          multiple: config.multiple,
        },
      }
    );
    return { spectator, component: spectator.component };
  };

  const errorsMessages: ValidationMessagesConfig = {
    email: 'Invalid email',
    required: 'Field is required',
    minlength: 'Min length is 5',
    maxlength: 'Max length is 10',
  };

  const customControl = new FormControl('', [
    Validators.email,
    Validators.maxLength(10),
    Validators.minLength(5),
    Validators.required,
  ]);

  it('should create', () => {
    const { component } = hostSetup({ control: customControl });
    expect(component).toBeTruthy();
  });

  it('should render multiple errors if multiple is set to true', () => {
    const { spectator, component } = hostSetup({
      control: customControl,
      errorsMessages: errorsMessages,
      multiple: true,
    });
    const control = component.control!;

    control.setValue('test');
    control.markAsDirty();

    spectator.fixture.detectChanges();
    expect(spectator.queryAll(selectors.validationError)).toHaveLength(2);
  });

  it('should render single error if multiple is set to false', () => {
    const { spectator, component } = hostSetup({
      control: customControl,
      errorsMessages,
    });
    const control = component.control!;

    control.setValue('test');
    control.markAsDirty();
    spectator.fixture.detectChanges();

    expect(spectator.queryAll(selectors.validationError)).toHaveLength(1);
  });

  it("should call define errors method when control's value or multiple errors flag changes", () => {
    const { spectator, component } = hostSetup({ control: customControl });
    const control = component.control!;
    const defineErrors = jest.spyOn(
      component as never,
      '_defineErrorsToBeShown'
    );

    control.setValue('');
    control.markAsDirty();
    spectator.detectComponentChanges();

    spectator.setInput('multiple', true);
    spectator.detectComponentChanges();
    expect(defineErrors).toHaveBeenCalledTimes(2);
  });
});
