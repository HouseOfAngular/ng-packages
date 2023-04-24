/**
 * @param str
 * @param params
 * @returns Interpolation of the path with the parameters.
 */
export function interpolate(str: string, params = {}): string {
  const paramsCopy: { [key: string]: string } = { ...params };
  const result: string[] = [];
  let segmentMatch;
  let key: string | null | undefined;

  (str || '').split(':').forEach((segment: string, i: number) => {
    if (i === 0 || !/^[a-z]/i.test(segment)) {
      result.push(i === 0 ? segment : ':' + segment);
    } else {
      segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
      key = segmentMatch?.[1];
      if (key) {
        result.push(paramsCopy[key]);
        result.push(segmentMatch?.[2] || '');
        delete paramsCopy[key];
      }
    }
  });

  return result.join('');
}
