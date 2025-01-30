function Track(flush = false): MethodDecorator {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const instance = CacheTool.getInstance();
      const value = originalMethod.apply(this, args);

      if (flush) {
        instance.saveCache();
      }

      return value;
    };
    return descriptor;
  } as any;
}

export type ProviderStorage = "session" | "local";

/**
 * Singleton class to manage cache in session or local storage
 *
 * @description
 * All read methods will get a fresh tracked storage, and All write operations are \
 * tracked and saved in storage. So when you call `put`, `remove` or `clear` \
 * the `saveCache` method are called automatically on track methods.
 *
 * @param id - Identifier of cache
 * @param provider - Provider of storage
 * @example
 * ```typescript
 * const cache = CacheTool.getInstance('cache', 'session')
 *
 * cache.put('foo', 'bar')
 * cache.get('foo') // bar
 * cache.remove('foo')
 *
 * ```
 */
export class CacheTool {
  private static instance: CacheTool;
  private cache: Map<string, any>;
  private provider: Storage;
  private id: string;

  private constructor(id: string, provider: ProviderStorage) {
    this.provider = window[`${provider}Storage`];
    this.cache = new Map<string, any>();
    this.id = id;
  }

  loadCache() {
    const cache = this.provider.getItem(this.id);
    if (cache) {
      this.cache = new Map(JSON.parse(cache));
    }
  }

  saveCache() {
    if (this.cache.size === 0) {
      this.provider.removeItem(this.id);
      return;
    }
    this.provider.setItem(this.id, JSON.stringify([...this.cache]));
  }

  public static getInstance(
    id = "cache",
    provider: ProviderStorage = "local"
  ): CacheTool {
    if (!CacheTool.instance) {
      CacheTool.instance = new CacheTool(id, provider);
      CacheTool.instance.loadCache();
    }
    return CacheTool.instance;
  }

  @Track(true)
  public put(key: string, value: unknown): void {
    this.cache.set(key, value);
  }

  @Track(true)
  public remove(key: string): void {
    this.cache.delete(key);
  }

  @Track(true)
  public clear(): void {
    this.cache.clear();
  }

  @Track()
  public get<T = any>(key: string): T {
    return this.cache.get(key) as T;
  }

  @Track()
  public size(): number {
    return this.cache.size;
  }

  @Track()
  public entries(): IterableIterator<[string, any]> {
    return this.cache.entries();
  }

  public *iter(): IterableIterator<[string, unknown]> {
    for (const [key, value] of this.cache.entries()) {
      yield [key, value];
    }
  }
}
