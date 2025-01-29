# RUSH - Memoization with Persistent Caching 🚀

**RUSH** is a lightweight TypeScript library designed to simplify caching and memoization in your applications. It provides an easy-to-use decorator for memoizing method results and manages persistent storage using `sessionStorage` or `localStorage`. Perfect for optimizing performance by avoiding redundant computations!

## Key Features ✨

- **Memoization**: Cache method results to avoid repeated executions.
- **Persistent Storage**: Store cached data in `sessionStorage` or `localStorage`.
- **TTL Support**: Set a time-to-live (TTL) for cached data.
- **Decorators**: Simple and intuitive decorators for memoization and cache tracking.

## Why Use RUSH? 🎯

- **Client-Side Focus**: Built specifically for browser environments.
- **Serializable Data**: Ensures compatibility with persistent storage by supporting only serializable data structures.
- **Flexible Configuration**: Customize cache keys, TTL, and storage providers.

## Quick Start 🚀

Install via npm:

```bash
npm install @nsx07/rush
```

Use the `Memoize` decorator to cache method results:

```typescript
import { Memoize, TTLCommon } from "@nsx07/rush";

class MyService {
  @Memoize({ ttl: TTLCommon.ONE_MINUTE })
  async fetchData(id: string): Promise<string> {
    console.log("Fetching data...");
    return `Data for ${id}`;
  }
}
```

## Get Started Today! 🌟

Optimize your app's performance with RUSH.
