/**
 * Returns all unique interpolable parameters from given string
 * @example
 * // returns ["name", "surname"]
 * getInterpolableParams("Hi I'm {{name}} {{surname}}.")
 */
export const getInterpolableParams = (str: string) => {
  return [...new Set(str.match(/\{\{([^{}]+)}}/g) || [])].map(param => param.slice(2, -2));
};
