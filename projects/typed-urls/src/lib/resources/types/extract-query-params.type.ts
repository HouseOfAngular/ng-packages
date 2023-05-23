import { ExtractType } from './extract-type.type';
import { Partial } from 'lodash-decorators';

export type ExtractQueryParams<T> =
  /* eslint-disable-next-line */
  T extends `${infer Url}?${infer QueryParams}`
    ? ExtractQueryParams<QueryParams>
    : // Required query parameters (annotation with !)
    T extends `${infer ParamKey}=${infer ParamType}!&${infer Rest}`
    ? { [k in ParamKey]: ExtractType<ParamType> } & ExtractQueryParams<Rest>
    : T extends `${infer ParamKey}=${infer ParamType}!`
    ? { [k in ParamKey]: ExtractType<ParamType> }
    : // Optional Query Parameters
    T extends `${infer ParamKey}=${infer ParamType}&${infer Rest}`
    ? Partial<
        { [k in ParamKey]: ExtractType<ParamType> } & ExtractQueryParams<Rest>
      >
    : T extends `${infer ParamKey}=${infer ParamType}`
    ? Partial<{ [k in ParamKey]: ExtractType<ParamType> }>
    : Record<string, never>;
