import { interpolateRouteParams } from '../utils/interpolate/interpolate-route-params';
import { ExtractRouteParams } from '../types/extract-route-params.type';

export class InterpolatableUrl<T extends string> {
  constructor(private _url: string) {}

  public url(params: ExtractRouteParams<T>): string {
    return interpolateRouteParams(this._url, params);
  }
}
