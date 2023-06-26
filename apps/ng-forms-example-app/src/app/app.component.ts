import { Component } from '@angular/core';
import { ControlComponent } from './control/control.component';
import { UserFormComponent } from './user-form/user-form.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  imports: [ControlComponent, UserFormComponent, MatCardModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
