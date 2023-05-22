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
    // Url consist of 1 route parameters
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

  getItems(
    limit: number,
    order: boolean,
    searchQuery: string,
    itemTypes: Array<number>
  ): Observable<any> {
    /*
    Url consist of 4 query parameters
    Available types for query params:
    - string
    - number
    - boolean
    - array<type> e.g. array<string>
    - object
   */
    const url = urlFactory(
      `items?order=boolean&itemTypes=array<number>&limit=number&searchQuery=string`
    );
    return this.http.get(url.url({ limit, order, searchQuery, itemTypes }));
  }

  getUserItem(id: string, userItemId: string): Observable<any> {
    // Url consist of 2 route parameters
    const url = urlFactory(`${this.baseUrl}/:id/:userItemId`);
    return this.http.get(url.url({ id, userItemId }));
  }

  getUserItems(
    id: string,
    limit: number,
    order: boolean,
    searchQuery: string,
    itemTypes: Array<number>
  ): Observable<any> {
    // Url that consist of 1 route parameter and 4 query parameters
    const url = urlFactory(
      `${this.baseUrl}/:id/items?order=boolean&itemTypes=array<number>&limit=number&searchQuery=string`
    );
    return this.http.get(
      url.url({ id }, { limit, order, searchQuery, itemTypes })
    );
  }
}
