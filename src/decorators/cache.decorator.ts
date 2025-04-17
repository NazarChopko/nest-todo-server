import { ClassConstructor, plainToInstance } from 'class-transformer';
import { CacheService } from '../cache/cache.service';

export function Cached<T>(
  classType: ClassConstructor<T>,
  ttlInSeconds: number,
  key?: string | ((...args: unknown[]) => string),
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: unknown[]) => Promise<T>>,
  ) {
    const originalMethod = descriptor.value;

    if (!originalMethod) {
      throw new Error(`Decorator @Cached can only be applied to methods.`);
    }

    descriptor.value = async function (...args: unknown[]): Promise<T> {
      let cacheKey = `cache:${propertyKey}:`;

      if (typeof key === 'function') {
        cacheKey += key(...args);
      } else if (typeof key === 'string') {
        cacheKey += key;
      } else {
        cacheKey += JSON.stringify(args);
      }

      const cacheManager = CacheService.getInstance();

      const cached = await cacheManager.get<T>(cacheKey);

      if (cached !== null) {
        console.log('cached');
        return plainToInstance(classType, cached, {
          enableImplicitConversion: true,
        });
      }
      console.log('not cached');
      const result = await originalMethod.apply(this, args);
      await cacheManager.set<T>(cacheKey, result, ttlInSeconds * 1000);

      return result;
    };

    return descriptor;
  };
}
