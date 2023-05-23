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
  const queryParams = queryParamsStr
    .split('&')
    // Remove required param annotation from query parameters
    .map((param) =>
      param.endsWith('!') ? param.slice(0, param.length - 1) : param
    )
    .map((param) => param.split('='))
    .map(([param]) => `${param}=${paramsCopy[param]}`)
    .join('&');

  return `${urlStart}?${queryParams}`;
}
