# Validation Messages

The Validation Messages package is designed to handle validation messages in Angular applications.

## Installation

`npm install @house-of-angular/validation-messages`

# Usage

### 1. Import ValidationMessagesModule

In the module where you want to use the ng-validation-messages component, import the ValidationMessagesModule as follows:

```ts
@NgModule({
    imports: [
        CommonModule,
        ValidationMessagesModule
    ]
})
export class AppModule { }
```

### 2. Configuration

To configure the validation messages, you need to perform the following steps:

**Step 2.1: Inject ValidationMessagesService**

Inject the ValidationMessagesService into the constructor of the root module of your application or create a service that is provided at the root level and inject the ValidationMessagesService into it.

```ts
@NgModule({
  imports: [
    CommonModule,
    ValidationMessagesModule
  ]
})
export class AppModule {
  constructor(private validationMessagesService: ValidationMessagesService) {}
}
```
or
```ts
@Injectable({
  providedIn: 'root'
})
export class ValidationMessagesConfigService {
  constructor(private validationMessagesService: ValidationMessagesService) {}
}
```

**Step 2.2: Define Validation Messages**

Define the global messages for validators by creating a configuration object of type ValidationMessagesConfig. There are two ways to provide error message definitions:
- Using key-value pairs, where the key is the validator key in the `FormControl`'s "errors" object and the value is the error message to be displayed. For example, see the **required** and **email** messages in the example configuration below.
- Providing an object of type ValidationMessage under a key. For example, see the **lettersPattern** message in the example configuration below.

Here is an example configuration:
```ts
  const validationMessagesConfig: ValidationMessagesConfig = {
  required: 'Field is required',
  email: 'Invalid email',
  min: 'Value is too small: {{actual}}/{{min}}',
  max: 'Value is too large {{actual}}/{{max}}',
  minlength: 'Too short {{actualLength}}/{{requiredLength}}',
  maxlength: 'Too long {{actualLength}}/{{requiredLength}}',
  customValidator: 'Custom validator error message',
  lettersPattern: {
    message: 'Must contains only letters',
    pattern: '$[a-zA-Z]*$',
  }
};
```

Once the configuration object is created, pass it as a parameter to the `setValidationMessages` method of the ValidationMessagesService.

```ts
const validationMessagesConfig: ValidationMessagesConfig = {
  required: 'Field is required',
  ...
};

@NgModule({
  imports: [...]
})
export class AppModule {
  constructor(private validationMessagesService: ValidationMessagesService) {
    this.validationMessagesService.setValidationMessages(validationMessagesConfig);
  }
}
```

# 3. Usage in templates

Now, in your component's template, you can use the `ValidationMessagesComponent` to display the validation messages. If you are using Angular Material, the validation messages component will automatically retrieve the form control from the mat-form-field.

```html
<mat-form-field>
  <mat-label>Name</mat-label>
  <input matInput formControlName="name" />
  <mat-error>
    <ng-validation-messages></ng-validation-messages>
  </mat-error>
</mat-form-field>
```

Alternatively, you can manually pass the control to the ValidationMessagesComponent by specifying either the `controlName` or `control` input:

```html
<ng-validation-messages [control]="name"></ng-validation-messages>
<ng-validation-messages controlName="formControlName"></ng-validation-messages>
```

### Local validator messages

You can extend and override the global validator messages by specifying local validator messages using the `errorsMessages` input:

```html
<ng-validation-messages
  [errorsMessages]="{
      minlength: 'Required characters: {{actualLength}}/{{requiredLength}}',
    }"
></ng-validation-messages>
```

### Interpolable parameters

You can specify parameters in the error messages using `{{parameterName}}`. These parameters allow you to access values from the error object. If the desired parameter is nested, you can use dot notation to access it, for example, `{{rootKey.childKey}}`.

# 4. API

### ValidationMessagesService

##### Methods:

`setValidationMessages(config: ValidationMessagesConfig)`: Sets validation messages configuration

`setTemplateMatcher(matcher: RegExp)`: Sets specifies which part of the message string will be replaced with default interpolated value (the default matcher is `/{{(.*)}}+/g`)

`useMaterialErrorMatcher()`: If ValidationMessagesComponent is used together with custom errorStateMatcher for Angular Material's matInput and this method is called, the errors will be shown instantly and not on lost focus (errorStateMatcher needs to reflect that).

### ValidationMessagesComponent

##### Inputs:

`errorsMessages: ValidationMessagesConfig`: Defines the local validation messages configuration. This configuration extends the global configuration.

`multiple: boolean`: Specifies whether to show multiple error messages (default: false)

`apiErrorMessages: Array<string | ApiErrorMessage>`: If an error is returned from an API request, this input allows to display it instantly

`control: FormControl`: Specifies the form control for which errors should be shown.

`controlName: string`: Specifies the name of the form control for which errors should be shown.

### Validation Message Interface

```ts
export interface ValidationMessage {
  message: string;
  validatorValue?: string;
  pattern?: string;
  validatorValueParser?: (value: any) => string;
  templateMatcher?: RegExp;
}
```
`validatorValue`: specifies the name of the property under the validator name in Form Control errrors object from where the value for interpolation will be taken.

`validatorValueParser`: specifies a function to parse the validator value

`templateMatcher`: specifies which part of the message string will be replaced with interpolated value (the default matcher is /{{(.*)}}+/g)

`pattern`: specifies pattern for which the message will be shown when using Angular pattern validator
