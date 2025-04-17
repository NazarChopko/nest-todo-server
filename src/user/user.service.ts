import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from 'src/services/prismaClient/prisma.service';
import { User, UserProfile } from './types/user';
import { S3ClientService } from 'src/services/awsS3Client/s3Client.service';
import { ConfigService } from '@nestjs/config';
import {
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { UserDtoForCache } from './dto/user.dto';
import { Cached } from 'src/decorators/cache.decorator';

@Injectable()
export class UserService {
  constructor(
    private prismaClient: PrismaService,
    private readonly s3Client: S3ClientService,
    private readonly configService: ConfigService,
  ) {}
  async getUser(
    email: string,
  ): Promise<(UserProfile & { password: string }) | null> {
    return this.prismaClient.user.findUnique({
      where: {
        email,
      },
      include: { role: true },
    });
  }

  async createUser(user: {
    email: string;
    password: string;
  }): Promise<(User & { password: string }) | null> {
    return this.prismaClient.user.create({
      data: {
        email: user.email,
        password: user.password,
      },
    });
  }

  async updateUser(
    userId: number,
    user: {
      userName: string;
      address: string;
    },
    file: Express.Multer.File,
  ) {
    const { address, userName } = user;
    const existingUser = await this.prismaClient.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, userInfo: true },
    });

    if (!existingUser) {
      throw new InternalServerErrorException('User was not found');
    }
    let awsFolderName = existingUser.userInfo?.userImage;

    if (file) {
      if (awsFolderName) {
        const deleteParams = {
          Bucket: this.configService.getOrThrow<string>('awsBucketName'),
          Key: awsFolderName,
        };
        const command = new DeleteObjectCommand(deleteParams);
        await this.s3Client.s3.send(command);
      }

      const extention = file?.originalname.split('.').pop();
      awsFolderName = `dev/uploads/avatars/${Date.now()}.${extention}`;

      const params = {
        Bucket: this.configService.getOrThrow<string>('awsBucketName'),
        Key: awsFolderName,
        Body: file?.buffer,
        ContentType: file?.mimetype,
      };
      const command = new PutObjectCommand(params);
      await this.s3Client.s3.send(command);
    }

    return this.prismaClient.user.update({
      where: { id: userId },
      data: {
        userInfo: existingUser.userInfo
          ? { update: { userImage: awsFolderName, address, userName } }
          : {
              create: {
                userImage: awsFolderName,
                address: address || null,
                userName: userName || null,
              },
            },
      },
      select: {
        id: true,
        email: true,
        userInfo: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Cached(UserDtoForCache, 60, (email: string) => email)
  async getAccount(email: string): Promise<UserProfile | any> {
    const user = await this.prismaClient.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        id: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        userInfo: true,
      },
    });

    return user;
  }

  async downloadFile(fileName: string) {
    const checkFileOnS3 = async (fileName: string) => {
      const params = {
        Bucket: this.configService.getOrThrow<string>('awsBucketName'),
        Key: `dev/uploads/files/${fileName}`,
      };

      try {
        const command = new HeadObjectCommand(params);
        await this.s3Client.s3.send(command);
        return true;
      } catch (error) {
        return false;
      }
    };

    const getFileFromS3 = async (fileName: string) => {
      const params = {
        Bucket: this.configService.getOrThrow<string>('awsBucketName'),
        Key: `dev/uploads/files/${fileName}`,
      };

      const command = new GetObjectCommand(params);
      const { Body } = await this.s3Client.s3.send(command);

      if (!Body) {
        throw new InternalServerErrorException("Body doens't exist");
      }

      return { Body };
    };
    const fileExists = await checkFileOnS3(fileName);

    if (!fileExists) {
      throw new InternalServerErrorException('File isnt found on aws');
    }
    return await getFileFromS3(fileName);
  }
}
