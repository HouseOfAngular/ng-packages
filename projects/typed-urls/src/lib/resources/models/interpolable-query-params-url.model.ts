import { ExtractQueryParams } from '../types/extract-query-params.type';
import { interpolateQueryParams } from '../utils/interpolate/interpolate-query-params';

export class InterpolatableQueryParamsUrl<T extends string> {
  constructor(private _url: string) {}

  public url(queryParams: ExtractQueryParams<T>): string {
    return interpolateQueryParams(this._url, queryParams);
  }
}
