import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urlFactory } from '@house-of-angular/typed-urls';
import { User } from '../model/user.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = 'http://dummyjson.com/users';

  constructor(private http: HttpClient) {}

  getUserById(id: string): Observable<User> {
    const url = urlFactory(`${this.baseUrl}/:id`);
    return this.http.get(url.url({ id: id })).pipe(
      map((response: any) => {
        const { firstName, age, lastName } = response;
        return {
          firstName,
          age,
          lastName,
        };
      })
    );
  }

  getUserNested(id: string): Observable<User> {
    const url = urlFactory(`a/:id/:secondId`);
    return this.http.get(url.url({ id: id })).pipe(
      map((response: any) => {
        const { firstName, age, lastName } = response;
        return {
          firstName,
          age,
          lastName,
        };
      })
    );
  }
}
