import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/services/prismaClient/prisma.service';
import { S3ClientService } from 'src/services/awsS3Client/s3Client.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, S3ClientService],
  exports: [UserService],
})
export class UserModule {}
