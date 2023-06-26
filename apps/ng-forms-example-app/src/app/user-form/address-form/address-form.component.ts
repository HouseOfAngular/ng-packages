import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { FormGroupComponent } from '../../../../../../projects/ng-forms/src/lib/ng-forms/form-group/form-group.directive';
import { ControlComponent } from '../../control/control.component';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { NullableFormControl } from '../../../../../../projects/ng-forms/src/lib/ng-forms/types';

export interface AddressForm {
  city: string;
  street: string;
}

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ControlComponent, FormsModule],
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressFormComponent extends FormGroupComponent<AddressForm> {
  get cityControl() {
    return this.form.controls['city'] as NullableFormControl<string>;
  }

  get streetControl() {
    return this.form.controls['street'] as NullableFormControl<string>;
  }
}
