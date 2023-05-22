import { interpolateQueryParams } from './interpolate-query-params';

describe('interpolateQueryParams', () => {
  it('should interpolate single query param', () => {
    const sort = 'asc';
    const url = '/test?sort=string';

    expect(interpolateQueryParams(url, { sort })).toBe('/test?sort=asc');
  });

  it('should interpolate multiple query params', () => {
    const sort = 'asc';
    const minValue = 20;
    const url = '/test?sort=string&minValue=number';

    expect(interpolateQueryParams(url, { sort, minValue })).toBe(
      '/test?sort=asc&minValue=20'
    );
  });
});
