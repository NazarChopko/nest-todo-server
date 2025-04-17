import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService implements OnModuleInit {
  private static instance: CacheService;

  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  onModuleInit() {
    CacheService.instance = this;
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      throw new Error('CacheService is not initialized yet!');
    }
    return CacheService.instance;
  }

  async get<T>(key: string): Promise<T | null> {
    return this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, value: T, ttlInMs: number): Promise<void> {
    await this.cacheManager.set(key, value, ttlInMs);
  }
}
