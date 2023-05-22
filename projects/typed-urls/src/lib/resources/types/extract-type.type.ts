export type ExtractType<T> = T extends `any`
  ? /* eslint-disable-next-line */
    any
  : T extends `string`
  ? string
  : T extends `number`
  ? number
  : T extends `boolean`
  ? boolean
  : T extends `array<${infer ArrayType}>`
  ? Array<ExtractType<ArrayType>>
  : T extends `array`
  ? /* eslint-disable-next-line */
    Array<any>
  : T extends `object`
  ? object
  : never;
