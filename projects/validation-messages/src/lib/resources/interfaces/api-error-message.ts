export interface ApiErrorMessage {
  message: string;
  property: string;
}

export type ApiErrorMessages =
  | Array<ApiErrorMessage | string>
  | ApiErrorMessage
  | string
  | null;
