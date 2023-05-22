/**
 * @param url
 * @param params
 * @returns Interpolation of the path with the query parameters.
 */
export function interpolateQueryParams(url: string, params = {}) {
  const paramsCopy: { [key: string]: string } = { ...params };

  if (!url.indexOf('?')) {
    return url;
  }

  const [urlStart, queryParamsStr] = url.split('?');
  // todo should it set undefined values in the url ?
  const queryParams = queryParamsStr
    .split('&')
    .map((param) => param.split('='))
    .map(([param]) => `${param}=${paramsCopy[param]}`)
    .join('&');

  return `${urlStart}?${queryParams}`;
}
