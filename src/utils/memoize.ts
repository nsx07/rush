import { CacheTool, ProviderStorage } from "../utils/cache-tool";

/**
 * Opções de configuração da memoização.
 * @property key Chave de identificação do cache (quando ocultado, é feito um hash dos paramêtros e nome do método).
 * @property ttl Tempo máximo de vida do cache (em ms).
 * @property provider Provedor de armazenamento do cache.
 */
export type MemoizeOptions = {
  key?: string;
  /**
   * Tempo máximo de vida do cache (em ms).
   * @see TTLCommon
   */
  ttl?: number;
  provider?: ProviderStorage;
};

/**
 * Decorator que memoiza o resultado de um método, armazenando o resultado em cache
 * para evitar a execução repetida do método com os mesmos parâmetros.
 * APENAS UTILIZE EM MÉTODOS QUE RETORNEM DADOS SERIALIZÁVEIS.
 * @param options Opções de configuração da memoização.
 * @returns O método decorado.
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
  const sigla = typeof arg1 === "string" ? arg1 : undefined;

  return function (target: Function, method: string, descriptor: any) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const hashParams = btoa(
        args.map((arg) => JSON.stringify(arg)).join("_")
      ).slice(0, 10);
      const key = `${target.constructor.name}-${method}-${
        options?.key || sigla || hashParams
      }`;
      const maxAge = options?.ttl || 0;
      const provider = options?.provider || "session";
      const cacheKey = `${key}`;
      const cacheTool = CacheTool.getInstance("memoize-cache", provider);

      const cached = cacheTool.get(cacheKey);
      if (cached) {
        const { value, timestamp } = cached;
        const now = Date.now();

        if (!maxAge || now - timestamp < maxAge) {
          return value;
        } else {
          cacheTool.remove(cacheKey);
        }
      }

      const value = await originalMethod.apply(this, args);
      cacheTool.put(cacheKey, { value, timestamp: Date.now() });

      return value;
    };

    return descriptor;
  } as any;
}

export { Memoize };

export enum TTLCommon {
  UM_MINUTO = 60000,
  CINCO_MINUTOS = 300000,
  DEZ_MINUTOS = 600000,
  MEIA_HORA = 1800000,
  UMA_HORA = 3600000,
}
