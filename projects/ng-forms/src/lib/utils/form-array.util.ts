import { AbstractControl, FormArray } from '@angular/forms';
import { createFnInterceptor, proxify } from './object-proxify';

function resizeFormArrayToMatchValue(
  formArray: FormArray,
  value: any[],
  createFormItemControlFn: (
    itemValue: any,
    itemIndex: number
  ) => AbstractControl
) {
  const dataLength = value?.length || 0;
  if (dataLength < formArray.controls.length) {
    formArray.controls.length = dataLength;
  }
  while (formArray.controls.length < dataLength) {
    const newIndex = formArray.controls.length;
    const itemValue = value[newIndex];
    formArray.insert(newIndex, createFormItemControlFn(itemValue, newIndex), {
      emitEvent: false,
    });
  }
}

export function dynamicFormArray(
  formArray: FormArray,
  createFormItemControlFn: (
    itemValue: any,
    itemIndex: number
  ) => AbstractControl
) {
  const setValueFunctionInterceptor = createFnInterceptor<
    FormArray['setValue']
  >({
    argsInterceptor: ([value, ...rest]) => {
      resizeFormArrayToMatchValue(formArray, value, createFormItemControlFn);
      return [value, ...rest];
    },
  });
  return proxify(formArray, {
    functions: {
      setValue: setValueFunctionInterceptor,
      patchValue: setValueFunctionInterceptor,
      reset: setValueFunctionInterceptor,
    },
  });
}
