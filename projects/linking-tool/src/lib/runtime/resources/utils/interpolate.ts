import {LinkParams} from "../models";

export function interpolate(arg: string, params: LinkParams): string {
  params = { ...params };
  const result: any[] = [];
  let segmentMatch: any[] | null = [];
  let key: string;

  (arg || '').split(':').forEach((segment: string, i: number) => {
    if (i === 0 || !/^[a-z]/i.test(segment)) {
      result.push(i === 0 ? segment : ':' + segment);
    } else {
      segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
      key = segmentMatch?.[1];
      result.push(params[key]);
      result.push(segmentMatch?.[2] || '');
      delete params[key];
    }
  });

  return result.join('');
}
