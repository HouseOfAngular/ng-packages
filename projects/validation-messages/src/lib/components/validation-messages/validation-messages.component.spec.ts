import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormControl, Validators } from '@angular/forms';
import { ValidationMessagesModule } from '../../validation-messages.module';
import { ValidationMessagesComponent } from './validation-messages.component';
import { MatFormField } from '@angular/material/form-field';

describe('ValidationMessagesComponent', () => {
  let component: ValidationMessagesComponent;
  let fixture: ComponentFixture<ValidationMessagesComponent>;
  const expectedControl = new FormControl('', [
    Validators.email,
    Validators.min(10),
    Validators.max(10),
    Validators.maxLength(10),
    Validators.minLength(3),
    Validators.required,
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ValidationMessagesModule],
    })
      .overrideComponent(ValidationMessagesComponent, {
        add: {
          providers: [
            { provide: ControlContainer, useValue: {} },
            { provide: MatFormField, useValue: {} },
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationMessagesComponent);
    component = fixture.componentInstance;
    component.control = expectedControl;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
