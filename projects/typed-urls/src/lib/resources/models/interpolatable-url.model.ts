import { interpolateRouteParams } from '../utils/interpolate/interpolate-route-params';
import { ExtractRouteParams } from '../types/extract-route-params.type';
import { ExtractQueryParams } from '../types/extract-query-params.type';
import { interpolateQueryParams } from '../utils/interpolate/interpolate-query-params';

/**
 * Interpolatable url is an url that consists both of route and query params
 */
export class InterpolatableUrl<T extends string> {
  constructor(private _url: string) {}

  public url(
    routeParams: ExtractRouteParams<T>,
    queryParams: ExtractQueryParams<T>
  ): string {
    const interpolatedUrl = interpolateRouteParams(this._url, routeParams);
    return interpolateQueryParams(interpolatedUrl, queryParams);
  }
}
