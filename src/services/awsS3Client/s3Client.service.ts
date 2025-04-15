import { S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3ClientService {
  s3: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('awsAccessKey'),
        secretAccessKey: this.configService.getOrThrow<string>('awsSecretKey'),
      },
      region: this.configService.getOrThrow<string>('awsRegion'),
    });
  }
}
