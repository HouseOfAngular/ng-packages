import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { FormControlComponent } from '@house-of-angular/ng-forms';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from '@angular/material/form-field';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './control.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ControlComponent),
      multi: true,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  styleUrls: ['./control.component.scss'],
})
export class ControlComponent
  extends FormControlComponent<string>
  implements OnInit, ControlValueAccessor
{
  @Input({ required: true }) label!: string;
  registerOnChange: (value: string) => void = () => '';
  registerOnTouched: () => void = () => '';
  writeValue: () => void = () => '';
}
