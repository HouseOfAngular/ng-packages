export interface Parser {
  parse: ((str: string, params?: any) => string);
}
