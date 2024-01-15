import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ValidationMessagesComponent } from './components/validation-messages/validation-messages.component.js';

@NgModule({
  imports: [CommonModule],
  declarations: [ValidationMessagesComponent],
  exports: [ValidationMessagesComponent],
})
export class ValidationMessagesModule {}
