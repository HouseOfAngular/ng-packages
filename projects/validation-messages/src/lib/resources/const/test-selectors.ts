const baseSelector = (selector: string) => `[data-test=${selector}]`;

export const selectors = {
  validationError: baseSelector('validation-error'),
  validationApiError: baseSelector('validation-api-error'),
};
