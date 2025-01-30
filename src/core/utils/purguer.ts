import { CacheTool } from "../cache-tool";

export function purge(key: string) {
  if ("onhashchange" in window) {
    window.addEventListener("hashchange", () => {
      const cache = CacheTool.getInstance(key);
      const entries = Array.from(cache.entries());
      const now = Date.now();

      const expired = entries.filter(([_, { timestamp }]) => {
        return now - timestamp >= 0;
      });

      expired.forEach(([key]) => {
        cache.remove(key);
      });
    });
  }
}
