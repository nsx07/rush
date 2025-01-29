# RUSH - Memoization with persistent caching

A TypeScript library for caching and memoization, providing a simple and efficient way to cache method results and manage storage in `sessionStorage` or `localStorage`.

---

## Features

- **Memoization**: Cache the results of methods to avoid redundant computations.
- **Storage Management**: Store cached data in `sessionStorage` or `localStorage`.
- **TTL Support**: Set a time-to-live (TTL) for cached data.
- **Decorators**: Easy-to-use decorators for memoization and cache tracking.

---

## Flags! ⚑⚑

- **Client side**: This library is aiming only the browsers at this moment.
- **Data structures**: Due to persistent caching, the implementation does not support non-serializable data structures. Pay attention in it mind when using.

## Installation

Install the library via npm:

```bash
npm install @nsx07/rush
```

---

## Usage

### Importing the Library

```typescript
import { CacheTool, Memoize, TTLCommon } from "@nsx07/rush";
```

---

### Using the `CacheTool`

The `CacheTool` is a singleton class that manages cache storage.

#### Example: Basic Cache Operations

```typescript
// Get an instance of CacheTool
const cache = CacheTool.getInstance("my-cache", "session");

// Store a value in the cache
cache.put("key1", "value1");

// Retrieve a value from the cache
const value = cache.get<string>("key1"); // Returns 'value1'

// Remove a value from the cache
cache.remove("key1");

// Clear the entire cache
cache.clear();
```

---

### Using the `Memoize` Decorator

The `Memoize` decorator caches the result of a method based on its parameters.

#### Example: Memoizing a Method

```typescript
class MyService {
  @Memoize({ ttl: TTLCommon.ONE_MINUTE }) // Cache result for 1 minute
  async fetchData(id: string): Promise<string> {
    console.log("Fetching data...");
    return `Data for ${id}`;
  }
}

const service = new MyService();

// First call - Fetches data and caches the result
await service.fetchData("123"); // Logs "Fetching data..."

// Second call with the same parameter - Returns cached result
await service.fetchData("123"); // No logs, returns cached data
```

#### Example: Custom Cache Key

```typescript
class MyService {
  @Memoize("custom-key", { ttl: TTLCommon.FIVE_MINUTES }) // Custom key and 5-minute TTL
  async fetchData(id: string): Promise<string> {
    console.log("Fetching data...");
    return `Data for ${id}`;
  }
}
```

#### Example: Custom TTL

```typescript
class MyService {
  @Memoize("custom-key", { ttl: TTLCommon.ONE_MINUTE * 33 }) // Custom key and computed TTL
  async fetchData(id: string): Promise<string> {
    console.log("Fetching data...");
    return `Data for ${id}`;
  }
}
```

## API Reference

### `Memoize`

- **`@Memoize(options?: Partial<MemoizeOptions>)`**: Decorator to memoize a method.
- **`@Memoize(key: string, options?: Partial<MemoizeOptions>)`**: Decorator with a custom cache key.

---

## Configuration Options

### `MemoizeOptions`

- **`key?: string`**: Custom cache key.
- **`ttl?: number`**: Time-to-live for the cache (in milliseconds).
- **`provider?: ProviderStorage`**: Storage provider (`'session'` or `'local'`).

### `TTLCommon`

Predefined TTL values:

- `ONE_MINUTE`: 60,000 ms
- `FIVE_MINUTES`: 300,000 ms
- `TEN_MINUTES`: 600,000 ms
- `HALF_HOUR`: 1,800,000 ms
- `ONE_HOUR`: 3,600,000 ms

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

```

```
