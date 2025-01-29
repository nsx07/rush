"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheTool = void 0;
function Track(flush = false) {
    return function (target, key, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const instance = CacheTool.getInstance();
            const value = originalMethod.apply(this, args);
            if (flush) {
                instance.saveCache();
            }
            return value;
        };
        return descriptor;
    };
}
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
class CacheTool {
    constructor(id, provider) {
        this.provider = window[`${provider}Storage`];
        this.cache = new Map();
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
    static getInstance(id = "cache", provider = "local") {
        if (!CacheTool.instance) {
            CacheTool.instance = new CacheTool(id, provider);
            CacheTool.instance.loadCache();
        }
        return CacheTool.instance;
    }
    put(key, value) {
        this.cache.set(key, value);
    }
    remove(key) {
        this.cache.delete(key);
    }
    clear() {
        this.cache.clear();
    }
    get(key) {
        return this.cache.get(key);
    }
    size() {
        return this.cache.size;
    }
    entries() {
        return this.cache.entries();
    }
    *iter() {
        for (const [key, value] of this.cache.entries()) {
            yield [key, value];
        }
    }
}
exports.CacheTool = CacheTool;
__decorate([
    Track(true)
], CacheTool.prototype, "put", null);
__decorate([
    Track(true)
], CacheTool.prototype, "remove", null);
__decorate([
    Track(true)
], CacheTool.prototype, "clear", null);
__decorate([
    Track()
], CacheTool.prototype, "get", null);
__decorate([
    Track()
], CacheTool.prototype, "size", null);
__decorate([
    Track()
], CacheTool.prototype, "entries", null);
