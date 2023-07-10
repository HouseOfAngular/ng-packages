import {Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {ControlComponent} from '../control/control.component';
import {AddressForm, AddressFormComponent,} from './address-form/address-form.component';
import {FormGroupComponent} from "@house-of-angular/ng-forms";

export interface UserDetailsForm {
  name: string;
  surname?: string;
  address: AddressForm;
}

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, ControlComponent, AddressFormComponent],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent
  extends FormGroupComponent<UserDetailsForm>
{}
