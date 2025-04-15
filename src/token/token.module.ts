import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Module({
  controllers: [TokenController],
  providers: [TokenService, JwtService, ConfigService],
  exports: [TokenService],
})
export class TokenModule {}
