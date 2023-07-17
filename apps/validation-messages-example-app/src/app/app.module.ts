import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  ValidationMessagesConfig,
  ValidationMessagesModule,
  ValidationMessagesService,
} from '../../../../projects/validation-messages/src';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    ValidationMessagesModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  validationMessagesConfig: ValidationMessagesConfig = {
    required: 'Field is required',
    email: 'Invalid email',
    min: 'Value is too small: {{actual}}/{{min}}',
    max: 'Value is too large {{actual}}/{{max}}',
    minlength: 'Too short {{actualLength}}/{{requiredLength}}',
    maxlength: 'Too long {{actualLength}}/{{requiredLength}}',
    lettersPattern: {
      message: 'Must contains only letters {{requiredPattern}}',
      pattern: '^[a-zA-Z]*$',
    },
    pattern: 'Must follow the pattern',
  };

  constructor(private validationMessagesService: ValidationMessagesService) {
    this.validationMessagesService.setValidationMessages(
      this.validationMessagesConfig
    );
  }
}
