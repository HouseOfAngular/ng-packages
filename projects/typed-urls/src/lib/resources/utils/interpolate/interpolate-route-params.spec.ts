import { interpolateRouteParams } from './interpolate-route-params';

describe('interpolateRouteParams', () => {
  it('should interpolateRouteParams value', () => {
    const testId = '2';
    const url = '/test/:testId';

    expect(interpolateRouteParams(url, { testId })).toBe('/test/2');
  });
});
