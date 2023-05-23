import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urlFactory } from '@house-of-angular/typed-urls';
import { User } from '../model/user.interface';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://dummyjson.com/users';
  private endpoints = {
    user: urlFactory(`${this.baseUrl}/:id`),
    items: urlFactory(
      `items?order=boolean&itemTypes=array<number>&limit=number&searchQuery=string`
    ),
    userItems: urlFactory(
      `${this.baseUrl}/:id/items?order=boolean&itemTypes=array<number>&limit=number&searchQuery=string`
    ),
  };

  constructor(private http: HttpClient) {}

  getUserById(id: string): Observable<User> {
    return this.http.get(this.endpoints.user.url({ id: id })).pipe(
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
    return this.http.get(
      this.endpoints.items.url({ limit, order, searchQuery, itemTypes })
    );
  }

  getUserItem(id: string, userItemId: string): Observable<any> {
    const url = urlFactory(`${this.baseUrl}/:id/:userItemId`);
    return this.http.get(url.url({ id, userItemId }));
  }

  getUserItems(
    id: string,
    limit: number,
    order: boolean,
    searchQuery: string,
    itemTypes: number[]
  ): Observable<any> {
    return this.http.get(
      this.endpoints.userItems.url({ id }, { limit, searchQuery, itemTypes })
    );
  }
}
