import { AngularValidatorsWithValue, AngularValidatorValue } from '../enums';

export const angularValidatorsWithValueMap: Record<AngularValidatorsWithValue, AngularValidatorValue> = {
  [AngularValidatorsWithValue.MaxLength]: AngularValidatorValue.RequiredLength,
  [AngularValidatorsWithValue.MinLength]: AngularValidatorValue.RequiredLength,
  [AngularValidatorsWithValue.Pattern]: AngularValidatorValue.RequiredPattern
};
