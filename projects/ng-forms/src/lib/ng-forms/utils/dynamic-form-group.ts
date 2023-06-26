import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  createFnInterceptor,
  Interceptor,
  PropGetter,
  proxify,
} from './object-proxify';
import { dynamicFormArray } from './form-array.util';

function mergeObjects<T>(a: T, b: Partial<T>) {
  let changed = false;
  const newObj = { ...a };
  for (const prop in b) {
    if (Object.prototype.hasOwnProperty.call(b, prop)) {
      const aValue = a[prop];
      const bValue = b[prop];
      const merged: any = merge<any>(aValue, bValue);
      changed = changed || aValue !== merged;
      newObj[prop] = merged;
    }
  }
  if (changed) {
    return newObj;
  }
  return a;
}

function mergeArrays<T extends any[]>(a: T, b: T) {
  const aLen = a.length;
  const bLen = b.length;
  if (aLen === bLen) {
    if (a.every((item, index) => b[index] === item)) {
      return a;
    }
  }
  return b;
}

export function merge<T1>(a: T1, b: any): T1 {
  if (typeof b === 'undefined') {
    return a;
  }
  if (!a || (a && !b)) {
    return b;
  }
  if (typeof a === 'object') {
    if (Array.isArray(a)) {
      return mergeArrays(a, b as unknown as typeof a) as unknown as T1;
    } else {
      return mergeObjects(a, b);
    }
  }
  return a === b ? a : b;
}

interface FormGroupConfig {
  parentPath: string[];
  createControlForValue: CreateControlForValueFn;
  resetBehavior: 'last supplied value' | 'blank controls';
}

export function dynamicFormGroup(
  formGroup: FormGroup,
  config: Partial<FormGroupConfig> = {}
) {
  const _config: FormGroupConfig = {
    parentPath: [],
    createControlForValue: defaultCreateControlForValue,
    resetBehavior: 'last supplied value',
    ...config,
  };
  const privateState = {
    originalValue: formGroup.value,
    baseValue: formGroup.value,
    latestFormValue: formGroup.value,
    latestMergedValue: formGroup.value,
  };

  function memoizedMergeWith(formValue: any) {
    if (formValue === privateState.latestFormValue) {
      return privateState.latestMergedValue;
    }
    const merged = merge(privateState.baseValue, formValue);
    privateState.latestFormValue = formValue;
    privateState.latestMergedValue = merged;
    return merged;
  }

  const setValueFunctionInterceptor = createFnInterceptor<
    FormGroup['setValue']
  >({
    argsInterceptor: ([value, ...rest]) => {
      if (privateState.baseValue !== value) {
        privateState.originalValue = value;
        privateState.baseValue = value;
        privateState.latestFormValue = null;
        privateState.latestMergedValue = value;
      }
      if (value) {
        const newValue = adaptValueToMatchControls(formGroup, value);
        return [newValue, ...rest];
      }
      return [value, ...rest];
    },
  });
  const resetFunctionInterceptor = createFnInterceptor<FormGroup['reset']>({
    callInterceptor(fn, thisArg, args) {
      const [value, ...rest] = args;
      if (_config.resetBehavior === 'last supplied value') {
        const hasBoxedEntries = Object.entries(value || {}).some(([key, val]) =>
          isBoxedControlValue(val)
        );
        if (!hasBoxedEntries && value) {
          privateState.originalValue = value;
        }
        privateState.baseValue = privateState.originalValue;
        privateState.latestFormValue = null;
        privateState.latestMergedValue = null;
        const valueForReset = hasBoxedEntries
          ? merge(privateState.originalValue, value)
          : privateState.originalValue;
        if (valueForReset) {
          const newValue = adaptValueToMatchControls(formGroup, valueForReset);
          fn.apply(thisArg, [newValue, ...rest]);
          return;
        }
        fn.apply(thisArg, [value, ...rest]);
        return;
      }
      if (_config.resetBehavior === 'blank controls') {
        const valueForReset = value
          ? adaptValueToMatchControls(formGroup, value)
          : value;
        fn.apply(thisArg, [valueForReset, ...rest]);
        privateState.originalValue = null;
        privateState.baseValue = null;
        privateState.latestFormValue = null;
        privateState.latestMergedValue = null;
        return;
      }
      throw new Error('dynamicFormGroup reset behavior must be configured');
    },
  });
  const addControlInterceptor = createFnInterceptor<FormGroup['addControl']>({
    argsInterceptor: (args) => {
      const [name, control] = args;
      const existingValue =
        privateState.baseValue && privateState.baseValue[name];
      if (typeof existingValue !== 'undefined') {
        control.patchValue(existingValue, { onlySelf: true, emitEvent: false });
      }
      return args;
    },
  });
  const removeControlInterceptor = createFnInterceptor<
    FormGroup['removeControl']
  >({
    argsInterceptor: (args) => {
      const [name] = args;
      if (
        formGroup.controls[name] &&
        privateState.baseValue &&
        privateState.baseValue[name]
      ) {
        const newBaseValue = { ...privateState.baseValue };
        delete newBaseValue[name];
        privateState.baseValue = newBaseValue;
      }
      return args;
    },
  });
  const getControlInterceptor: Interceptor<FormGroup['get']> =
    createFnInterceptor<FormGroup['get']>({
      callInterceptor: (fn, thisArg, args) => {
        const returnValue = fn.apply(thisArg, args);
        if (!returnValue) {
          const [path] = args;
          const pathArray = Array.isArray(path)
            ? path.map((i) => i + '')
            : (path || '').split('.');
          const existingValue = getDeepPropValue(
            privateState.baseValue,
            pathArray
          );
          const isFormGroupProp = path.length === 1;
          if (existingValue && isFormGroupProp) {
            const newControl = _config.createControlForValue(
              pathArray,
              existingValue,
              _config
            );
            newControl.patchValue(existingValue, {
              onlySelf: true,
              emitEvent: false,
            });
            formGroup.registerControl(pathArray[0], newControl);
            return newControl;
          }
        }
        return returnValue;
      },
    });

  return proxify(formGroup, {
    functions: {
      setValue: setValueFunctionInterceptor,
      patchValue: setValueFunctionInterceptor,
      reset: resetFunctionInterceptor,
      addControl: addControlInterceptor,
      registerControl: addControlInterceptor as unknown as Interceptor<
        FormGroup['registerControl']
      >,
      setControl: addControlInterceptor,
      get: getControlInterceptor,
      removeControl: removeControlInterceptor,
    },
    props: {
      value: {
        get: createFnInterceptor<PropGetter<FormGroup['value']>>({
          returnValueInterceptor(returnValue) {
            return memoizedMergeWith(returnValue);
          },
        }),
      },
      valueChanges: {
        get: createFnInterceptor<PropGetter<FormGroup['value']>>({
          returnValueInterceptor(returnValue: Observable<any>) {
            return returnValue.pipe(map(memoizedMergeWith));
          },
        }),
      },
    },
  });
}

export type CreateControlForValueFn = typeof defaultCreateControlForValue;

export function defaultCreateControlForValue(
  propPath: string[],
  existingValue: any,
  config: FormGroupConfig
): AbstractControl {
  if (typeof existingValue !== 'object') {
    return new FormControl();
  }
  if (Array.isArray(existingValue)) {
    return dynamicFormArray(new FormArray(<any[]>[]), (itemValue: any) =>
      config.createControlForValue([...propPath, '0'], itemValue, config)
    );
  }
  return dynamicFormGroup(new FormGroup({}), {
    ...config,
    parentPath: [...config.parentPath, ...propPath],
  });
}

function isBoxedControlValue(controlValue: any) {
  return (
    typeof controlValue === 'object' &&
    controlValue !== null &&
    Object.keys(controlValue).length === 2 &&
    'value' in controlValue &&
    'disabled' in controlValue
  );
}

function getDeepPropValue(obj: any, props: string[]): any {
  return (
    obj &&
    props.reduce(
      (result, prop) => (result == null ? undefined : result[prop]),
      obj
    )
  );
}

function adaptValueToMatchControls(formGroup: FormGroup, value: any) {
  const controlNames = Object.keys(formGroup.controls);
  const extraPropNames = Object.keys(value).filter(
    (key) => !controlNames.includes(key)
  );
  if (extraPropNames.length > 0) {
    const newValue = controlNames.reduce((obj: any, key) => {
      obj[key] = value[key];
      return obj;
    }, {});
    return newValue;
  }
  return value;
}
