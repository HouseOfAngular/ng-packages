import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ValidationMessagesComponent } from './components/validation-messages/validation-messages.component';
import { defaultValidationMessagesConfigProvider } from './resources';

@NgModule({
  imports: [CommonModule],
  declarations: [ValidationMessagesComponent],
  exports: [ValidationMessagesComponent],
  providers: [defaultValidationMessagesConfigProvider],
})
export class ValidationMessagesModule {}
