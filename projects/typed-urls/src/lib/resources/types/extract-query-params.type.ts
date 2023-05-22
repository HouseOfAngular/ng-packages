import { ExtractType } from './extract-type.type';

export type ExtractQueryParams<T> =
  /* eslint-disable-next-line */
  T extends `${infer Url}?${infer QueryParams}`
    ? ExtractQueryParams<QueryParams>
    : T extends `${infer ParamKey}=${infer ParamType}&${infer Rest}`
    ? { [k in ParamKey]: ExtractType<ParamType> } & ExtractQueryParams<Rest>
    : T extends `${infer ParamKey}=${infer ParamType}`
    ? { [k in ParamKey]: ExtractType<ParamType> }
    : never;
