import { CacheTool } from "./cache-tool";
import { CacheItem } from "./types/cache-item";
import { MemoizeOptions } from "./types/memoize-options";
import { purge } from "./utils/purguer";

let purged = false;

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

  if (!purged) {
    purge("memoize-cache");
  }

  purged = true;
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

      // Check if the cache exists
      const cached: CacheItem = cacheTool.get(cacheKey);
      if (cached) {
        const { value, timestamp } = cached;
        const now = Date.now();

        // Check if the cache is still valid
        if (!maxAge || now - timestamp < maxAge) {
          return value; // Return cached value
        } else {
          cacheTool.remove(cacheKey); // Remove expired cache
        }
      }

      // Execute the original method
      const result = originalMethod.apply(this, args);

      // Handle both synchronous and asynchronous methods
      if (result instanceof Promise) {
        // If the method is asynchronous, cache the resolved value
        return result.then((resolvedValue) => {
          cacheTool.put(cacheKey, {
            value: resolvedValue,
            timestamp: Date.now(),
          });
          return resolvedValue;
        });
      } else {
        // If the method is synchronous, cache the result directly
        cacheTool.put(cacheKey, { value: result, timestamp: Date.now() });
        return result;
      }
    };

    return descriptor;
  } as MethodDecorator;
}

export { Memoize };
