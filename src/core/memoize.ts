import { CacheTool } from "./cache-tool";
import { CacheItem } from "./types/cache-item";
import { MemoizeOptions } from "./types/memoize-options";

/**
 * Decorator that memoizes the result of a method, storing the result in cache \
 * to avoid repeated execution of the method with the same parameters. \
 *
 * `ONLY USE ON METHODS THAT RETURN SERIALIZABLE DATA.`
 *
 * @param options Memoization configuration options.
 * @returns The decorated method.
 */
function Memoize(options?: Partial<MemoizeOptions>): MethodDecorator;
function Memoize(
  key: string,
  options?: Partial<MemoizeOptions>
): MethodDecorator;
function Memoize(
  arg1?: string | Partial<MemoizeOptions>,
  arg2?: Partial<MemoizeOptions>
): MethodDecorator {
  const options = typeof arg1 === "string" ? arg2 : arg1;
  const customKey = typeof arg1 === "string" ? arg1 : undefined;

  return function (
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const hashParams = btoa(
        args.map((arg) => JSON.stringify(arg)).join("_")
      ).slice(0, 10);
      const cacheKey = `${target.constructor.name}-${methodName}-${
        options?.key || customKey || hashParams
      }`;
      const maxAge = options?.ttl || 0;
      const provider = options?.provider || "session";
      const cacheTool = CacheTool.getInstance("memoize-cache", provider);

      const cached: CacheItem = cacheTool.get(cacheKey);
      if (cached) {
        const { value, timestamp } = cached;
        const now = Date.now();

        if (now - timestamp < maxAge) {
          return value;
        } else {
          cacheTool;
        }
      }

      const result = originalMethod.apply(this, args);

      if (result instanceof Promise) {
        return result.then((resolvedValue) => {
          cacheTool.put(cacheKey, {
            value: resolvedValue,
            timestamp: Date.now(),
          });
          return resolvedValue;
        });
      } else {
        cacheTool.put(cacheKey, { value: result, timestamp: Date.now() });
        return result;
      }
    };

    return descriptor;
  } as MethodDecorator;
}

/**
 * Decorator that memoizes the result of a method, storing the result in cache \
 * to avoid repeated execution of the method with the same parameters. \
 *
 * `ONLY USE ON METHODS THAT RETURN SERIALIZABLE DATA.`
 *
 * @param options Memoization configuration options.
 * @returns The decorated method.
 */
function MemoizeAsync(options?: Partial<MemoizeOptions>): MethodDecorator;
function MemoizeAsync(
  key: string,
  options?: Partial<MemoizeOptions>
): MethodDecorator;
function MemoizeAsync(
  arg1?: string | Partial<MemoizeOptions>,
  arg2?: Partial<MemoizeOptions>
): MethodDecorator {
  const options = typeof arg1 === "string" ? arg2 : arg1;
  const customKey = typeof arg1 === "string" ? arg1 : undefined;

  return function (
    target: any,
    methodName: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const hashParams = btoa(
        args.map((arg) => JSON.stringify(arg)).join("_")
      ).slice(0, 10);
      const cacheKey = `${target.constructor.name}-${methodName}-${
        options?.key || customKey || hashParams
      }`;
      const maxAge = options?.ttl || 0;
      const provider = options?.provider || "session";
      const cacheTool = CacheTool.getInstance("memoize-cache", provider);

      const cached: CacheItem = cacheTool.get(cacheKey);
      if (cached) {
        const { value, timestamp } = cached;
        const now = Date.now();

        if (now - timestamp < maxAge) {
          return Promise.resolve(value);
        } else {
          cacheTool.remove(cacheKey);
        }
      }

      const result = originalMethod.apply(this, args);

      if (result instanceof Promise) {
        return result.then((resolvedValue) => {
          cacheTool.put(cacheKey, {
            value: resolvedValue,
            timestamp: Date.now(),
          });
          return resolvedValue;
        });
      } else {
        cacheTool.put(cacheKey, { value: result, timestamp: Date.now() });
        return result;
      }
    };

    return descriptor;
  } as MethodDecorator;
}

export { Memoize, MemoizeAsync };
