import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { FormGroupComponent } from '../../../../../projects/ng-forms/src/lib/ng-forms/form-group/form-group.directive';
import { ControlComponent } from '../control/control.component';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  NullableFormControl,
  NullableFormGroup,
} from '../../../../../projects/ng-forms/src/lib/ng-forms/types';
import {
  AddressForm,
  AddressFormComponent,
} from './address-form/address-form.component';

export interface UserDetailsForm {
  name: string;
  surname: string;
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
  implements OnInit
{
  userForm = this._fb.group({
    name: [''],
    address: this._fb.group({
      city: [''],
      street: [''],
    }),
  });

  get nameControl(): NullableFormControl<string> {
    return this.userForm.controls.name as NullableFormControl<string>;
  }

  get addressGroup(): NullableFormGroup<AddressForm> {
    return this.userForm.controls.address as NullableFormGroup<AddressForm>;
  }
}
