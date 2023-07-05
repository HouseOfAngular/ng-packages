/**
 * Adds `null` to all first order properties of an object
 *
 * @example
 * ```
 * interface Foo {
 *   one: string;
 *   two: { three: string; }
 * }
 *
 * // object typed as WithNullableFirstOrderProperties<Foo> will have the following type
 *
 * {
 *     one: string | null;
 *     two: { three: string; } | null;
 * }
 * ```
 */
export type WithNullableFirstOrderProperties<T> = T extends object
  ? {
      [K in keyof T]: T[K] | null;
    }
  : T | null;

export type NonNullableFirstOrderProperties<T> = T extends object
  ? {
      [K in keyof T]: Exclude<T[K], null | undefined>;
    }
  : Exclude<T, null | undefined>;

/**
 * A type guard to verify whether an object has non nullable properties
 *
 * @example
 * ```typescript
 * const value = this.form.value; // { first: Foo | null, second: number | null }
 * if (!isNonNullable(value, (v) => !!v.first && !!v.second)) {
 *   return;
 * }
 * console.log(value); // { first: Foo, second: number }
 * ```
 */
export function hasNonNullableFirstOrderProperties<T>(
  value: T,
  verifier: (value: T) => boolean
): value is NonNullableFirstOrderProperties<T> {
  return verifier(value);
}
