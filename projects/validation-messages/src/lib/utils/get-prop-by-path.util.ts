/**
 * Gets prop from object by path
 * @example
 * const object = {root: {child: "value"}}
 * // returns "value"
 * getPropByPath(object, "root.child")
 */
export const getPropByPath = (object: object , path: string | string[]): any => {
  const _path = Array.isArray(path) ? path : path.split('.');
  if (object && _path.length) {
    return getPropByPath(object[_path.shift() as keyof object], _path);
  }
  return object;
};
