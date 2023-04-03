import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { NxWelcomeComponent } from './nx-welcome.component';
import {ValidationMessagesModule} from "../../../../projects/validation-messages/src/lib/validation-messages.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes, {initialNavigation: 'enabledBlocking'}),
        ValidationMessagesModule,
        BrowserAnimationsModule,
      ReactiveFormsModule,
      MatInputModule,
      ValidationMessagesModule
    ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
