import { ProviderStorage } from "./provider-storage";

/**
 * Memoization configuration options.
 * @property key Cache identification key (when omitted, a hash of the method name and parameters is used).
 * @property ttl Maximum cache lifetime (in milliseconds).
 * @property provider Cache storage provider.
 */
export type MemoizeOptions = {
  key?: string;
  /**
   * Maximum cache lifetime (in milliseconds).
   * @see TTLCommon
   */
  ttl?: number;
  provider?: ProviderStorage;
};
