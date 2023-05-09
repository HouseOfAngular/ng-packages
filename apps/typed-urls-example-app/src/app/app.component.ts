import { Component } from '@angular/core';
import { UserService } from './service/user.service';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from './model/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  userForm = this.fb.group({
    userId: ['', Validators.required],
  });

  user$!: Observable<User>;

  get userIdValue() {
    return this.userForm.controls.userId.getRawValue();
  }
  constructor(
    private userService: UserService,
    private fb: NonNullableFormBuilder
  ) {}
  fetchUser() {
    this.user$ = this.userService.getUserById(this.userIdValue);
  }
}
