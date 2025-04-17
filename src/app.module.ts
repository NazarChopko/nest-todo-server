import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './logger/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { SeedService } from './services/prismaClient/seed.service';

import configuration from './config/configuration';
import { PrismaService } from './services/prismaClient/prisma.service';
import { TodoModule } from './todo/todo.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MyCacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UserModule,
    AuthModule,
    TodoModule,
    MyCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
