"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTLCommon = void 0;
exports.Memoize = Memoize;
const cache_tool_1 = require("../utils/cache-tool");
function Memoize(arg1, arg2) {
    const options = typeof arg1 === "string" ? arg2 : arg1;
    const sigla = typeof arg1 === "string" ? arg1 : undefined;
    return function (target, method, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const hashParams = btoa(args.map((arg) => JSON.stringify(arg)).join("_")).slice(0, 10);
                const key = `${target.constructor.name}-${method}-${(options === null || options === void 0 ? void 0 : options.key) || sigla || hashParams}`;
                const maxAge = (options === null || options === void 0 ? void 0 : options.ttl) || 0;
                const provider = (options === null || options === void 0 ? void 0 : options.provider) || "session";
                const cacheKey = `${key}`;
                const cacheTool = cache_tool_1.CacheTool.getInstance("memoize-cache", provider);
                const cached = cacheTool.get(cacheKey);
                if (cached) {
                    const { value, timestamp } = cached;
                    const now = Date.now();
                    if (!maxAge || now - timestamp < maxAge) {
                        return value;
                    }
                    else {
                        cacheTool.remove(cacheKey);
                    }
                }
                const value = yield originalMethod.apply(this, args);
                cacheTool.put(cacheKey, { value, timestamp: Date.now() });
                return value;
            });
        };
        return descriptor;
    };
}
var TTLCommon;
(function (TTLCommon) {
    TTLCommon[TTLCommon["UM_MINUTO"] = 60000] = "UM_MINUTO";
    TTLCommon[TTLCommon["CINCO_MINUTOS"] = 300000] = "CINCO_MINUTOS";
    TTLCommon[TTLCommon["DEZ_MINUTOS"] = 600000] = "DEZ_MINUTOS";
    TTLCommon[TTLCommon["MEIA_HORA"] = 1800000] = "MEIA_HORA";
    TTLCommon[TTLCommon["UMA_HORA"] = 3600000] = "UMA_HORA";
})(TTLCommon || (exports.TTLCommon = TTLCommon = {}));
