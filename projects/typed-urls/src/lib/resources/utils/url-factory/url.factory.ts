import { InterpolatableUrl } from '../../models/interpolatable-url.model';
import { Url } from '../../models/url.model';
import { InterpolatableRouteParamsUrl } from '../../models/interpolable-route-params-url.model';
import { InterpolatableQueryParamsUrl } from '../../models/interpolable-query-params-url.model';

const hasRouteParams = new RegExp('[/:]{2,}');
const hasQueryParams = new RegExp('[?]');

export type InferReturnType<T> =
  /* eslint-disable-next-line */
  T extends `${infer _Start}/:${infer RouteParam}?${infer QueryParams}`
    ? InterpolatableUrl<T>
    : /* eslint-disable-next-line */
    T extends `${infer _Start}?${infer QueryParams}`
    ? InterpolatableQueryParamsUrl<T>
    : /* eslint-disable-next-line */
    T extends `${infer _Start}/:${infer RouteParam}`
    ? /* eslint-disable-next-line */
      InterpolatableRouteParamsUrl<T>
    : /* eslint-disable-next-line */
    T extends `${infer _Start}?${infer QueryParams}`
    ? InterpolatableQueryParamsUrl<T>
    : Url;

export function urlFactory<T extends string>(url: T): InferReturnType<T> {
  const containQueryParams = hasQueryParams.test(url);
  const containRouteParams = hasRouteParams.test(url);

  if (containQueryParams && containRouteParams) {
    return new InterpolatableUrl<T>(url) as InferReturnType<T>;
  }

  if (containRouteParams) {
    return new InterpolatableRouteParamsUrl<T>(url) as InferReturnType<T>;
  }

  if (containQueryParams) {
    return new InterpolatableQueryParamsUrl<T>(url) as InferReturnType<T>;
  }

  return new Url(url) as InferReturnType<T>;
}
