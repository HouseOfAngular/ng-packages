import { LinkServiceBuilder } from './link.service.builder';
import { LinkType } from '../resources/enums';
import { LinkService } from './link.service';

describe('LinkServiceBuilder', () => {
  const linksMap = { link: 'link' };
  const linkType = { ...LinkType, link: 'link' };
  let serviceBuilder: LinkServiceBuilder;

  beforeEach(() => {
    serviceBuilder = new LinkServiceBuilder();
  });

  it('should be created', () => {
    expect(serviceBuilder).toBeTruthy();
  });

  it('should contain default LinkType enum', () => {
    expect(serviceBuilder.linkType).toBe(LinkType);
  });

  describe('build', () => {
    it('should return LinkService instance with linksMap and linkType', () => {
      const linkService = new LinkService();
      linkService.linksMap = linksMap;
      linkService.linkType = linkType;

      serviceBuilder.linksMap = linksMap;
      serviceBuilder.linkType = linkType;

      expect(serviceBuilder.build()).toEqual(linkService);
    });
  });

  describe('setLinksMap', () => {
    it('should set linksMap and return current builder instance', () => {
      expect(serviceBuilder.setLinksMap(linksMap)).toBe(serviceBuilder);
      expect(serviceBuilder.linksMap).toEqual(linksMap);
    });
  });

  describe('setLinkType', () => {
    it('should set linkType and return current builder instance', () => {
      expect(serviceBuilder.setLinkType(linkType)).toBe(serviceBuilder);
      expect(serviceBuilder.linkType).toEqual(linkType);
    });
  });
});
