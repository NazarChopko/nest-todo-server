import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import KeyvRedis from '@keyv/redis';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: [
          new KeyvRedis({
            url: `redis://${config.get('redisHost')}:${config.get('redisPort')}`,
          }),
        ],
      }),
      isGlobal: true,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class MyCacheModule {}
