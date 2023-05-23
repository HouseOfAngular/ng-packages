import { urlFactory } from './url.factory';
import { InterpolatableUrl } from '../../models/interpolatable-url.model';
import { Url } from '../../models/url.model';
import { InterpolatableQueryParamsUrl } from '../../models/interpolable-query-params-url.model';
import { InterpolatableRouteParamsUrl } from '../../models/interpolable-route-params-url.model';

describe('UrlFactory', () => {
  it('should return InterpolatableUrl', () => {
    const url = urlFactory('testUrl/:testId?queryParam=string');

    expect(url instanceof InterpolatableUrl).toBeTruthy();
  });

  it('should return InterpolatableRouteParamsUrl', () => {
    const url = urlFactory('testUrl/:testId');

    expect(url instanceof InterpolatableRouteParamsUrl).toBeTruthy();
  });

  it('should return InterpolatableQueryParamsUrl', () => {
    const url = urlFactory('testUrl?queryParam=string');

    expect(url instanceof InterpolatableQueryParamsUrl).toBeTruthy();
  });

  it('should return Url', () => {
    const url = urlFactory('testUrl');

    expect(url instanceof Url).toBeTruthy();
  });
});
