/// <reference types="jest" />

/* eslint-disable @typescript-eslint/ban-types */
type AnyFunction = (...args: any[]) => any;
type AnyFunctionOf<T> = (this: T, ...args: any[]) => any;

export type Interceptor<T> = (originalFn: T) => T;

type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends AnyFunctionOf<T> ? K : never;
}[keyof T];
type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends AnyFunctionOf<T> ? never : K;
}[keyof T];

export type FunctionInterceptorMap<T extends object> = {
  [K in FunctionPropertyNames<T>]?: Interceptor<T[K]>;
};
type FunctionInterceptorMapKey<T extends object> =
  keyof FunctionInterceptorMap<T>;
type FunctionInterceptorMapItem<T extends object> =
  FunctionInterceptorMap<T>[keyof FunctionInterceptorMap<T>];
type InterceptedFunction<T extends object> = T[FunctionPropertyNames<T>];

export type PropGetter<T> = () => T;
export type PropSetter<T> = (value: T) => boolean;

export type PropInterceptor<T> = {
  get?: Interceptor<PropGetter<T>>;
  set?: Interceptor<PropSetter<T>>;
};

export type PropInterceptorMap<T extends object> = {
  [K in NonFunctionPropertyNames<T>]?: PropInterceptor<T[K]>;
};
type PropInterceptorMapKey<T extends object> = keyof PropInterceptorMap<T>;
type PropInterceptorMapItem<T extends object> =
  PropInterceptorMap<T>[keyof PropInterceptorMap<T>];

export interface ProxyInterceptor<T extends object> {
  functions?: FunctionInterceptorMap<T>;
  props?: PropInterceptorMap<T>;
}

export function combineInterceptors<T extends object>(
  interceptors: ProxyInterceptor<T>[]
) {
  type ComposableInterceptor = FunctionInterceptorMapItem<T>;
  type ComposableInterceptorArg = InterceptedFunction<T>;

  const mappedFuncInterceptors = interceptors.reduce<
    Record<string, ComposableInterceptor[]>
  >((map, item) => {
    const funcMap: FunctionInterceptorMap<T> = item.functions || {};
    Object.entries(funcMap).forEach(([key, value]) => {
      const fns = map[key] || [];
      fns.push(value as ComposableInterceptor);
      map[key] = fns;
    });
    return map;
  }, {});

  const funcInterceptors: FunctionInterceptorMap<T> = {};
  Object.entries(mappedFuncInterceptors).forEach(([key, item]) => {
    funcInterceptors[key as keyof FunctionInterceptorMap<T>] = (
      fn: ComposableInterceptorArg
    ) => {
      return item.reduce((acc, interceptorFn) => {
        return interceptorFn ? interceptorFn(acc) : acc;
      }, fn);
    };
  });

  return {
    functions: funcInterceptors,
  };
}

export function proxify<T extends object>(
  target: T,
  intercept: ProxyInterceptor<T>
): T {
  const functionInterceptors =
    intercept.functions || ({} as FunctionInterceptorMap<T>);
  const propInterceptors = intercept.props || ({} as PropInterceptorMap<T>);
  const proxy = new Proxy(target, {
    get(_target, prop) {
      const funcKey = prop as FunctionInterceptorMapKey<T>;
      const funcInterceptor = functionInterceptors[funcKey];
      if (funcInterceptor) {
        const originalFn = _target[funcKey] as unknown as AnyFunctionOf<T>;
        const boundFn = originalFn.bind(
          _target
        ) as unknown as InterceptedFunction<T>;
        return funcInterceptor(boundFn);
      }
      const propKey = prop as PropInterceptorMapKey<T>;
      const propInterceptor = propInterceptors[propKey];
      if (propInterceptor && propInterceptor.get) {
        const originalFn = () => _target[propKey];
        const getter = propInterceptor.get(originalFn);
        return getter();
      }
      return Reflect.get(_target, prop);
    },
    set(_target, prop, value) {
      const propKey = prop as PropInterceptorMapKey<T>;
      const propInterceptor = propInterceptors[propKey];
      if (propInterceptor && propInterceptor.set) {
        const originalFn = (value: T[NonFunctionPropertyNames<T>]) => {
          return Reflect.set(_target, prop, value);
        };
        const setter = propInterceptor.set(originalFn);
        return setter(value);
      }
      return Reflect.set(_target, prop, value);
    },
  });
  return proxy;
}

type ArgsInterceptor<TFunc extends AnyFunction> = (
  args: Parameters<TFunc>
) => Parameters<TFunc>;

type CallInterceptor<TFunc extends AnyFunction> = (
  fn: TFunc,
  thisArg: any,
  args: Parameters<TFunc>
) => ReturnType<TFunc>;

type ReturnValueInterceptor<TFunc extends AnyFunction> = (
  returnValue: ReturnType<TFunc>
) => ReturnType<TFunc>;

interface InputOutputInterceptor<TFunc extends AnyFunction> {
  argsInterceptor?: ArgsInterceptor<TFunc>;
  callInterceptor?: CallInterceptor<TFunc>;
  returnValueInterceptor?: ReturnValueInterceptor<TFunc>;
}

export function createFnInterceptor<TFunc extends AnyFunction>(
  fnInterceptor: InputOutputInterceptor<TFunc>
): Interceptor<TFunc> {
  const argsInterceptor: ArgsInterceptor<TFunc> = fnInterceptor.argsInterceptor
    ? fnInterceptor.argsInterceptor.bind(fnInterceptor)
    : (args) => args;
  const callInterceptor: CallInterceptor<TFunc> = fnInterceptor.callInterceptor
    ? fnInterceptor.callInterceptor.bind(fnInterceptor)
    : (fn, thisArg, args) => fn.apply(thisArg, args);
  const returnValueInterceptor: ReturnValueInterceptor<TFunc> =
    fnInterceptor.returnValueInterceptor
      ? fnInterceptor.returnValueInterceptor.bind(fnInterceptor)
      : (returnValue) => returnValue;
  return (fn: TFunc) => {
    return <TFunc>(
      function interceptedFunction(this: any, ...args: Parameters<TFunc>) {
        const newArgs = argsInterceptor(args);
        const returnValue = callInterceptor(fn, this, newArgs);
        return returnValueInterceptor(returnValue);
      }
    );
  };
}
