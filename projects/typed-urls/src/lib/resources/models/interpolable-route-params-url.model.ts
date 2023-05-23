import { interpolateRouteParams } from '../utils/interpolate/interpolate-route-params';
import { ExtractRouteParams } from '../types/extract-route-params.type';

export class InterpolatableRouteParamsUrl<T extends string> {
  constructor(private _url: string) {}

  public url(routeParams: ExtractRouteParams<T>): string {
    return interpolateRouteParams(this._url, routeParams);
  }
}
