import { Params } from '@angular/router';

export interface LinkParams {
  anchor?: string;
  embedded?: { id: string };
  queryParams?: Params;
  skipLocationChange?: boolean;
  [key: string]: any;
}

export interface Link<T = string> {
  params?: LinkParams;
  path?: string;
  type?: T;
}
