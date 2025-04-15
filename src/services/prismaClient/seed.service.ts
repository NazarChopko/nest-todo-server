import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    console.log('Running seed...');
    await this.seedRoles();
    await this.createAdmin();
  }

  async seedRoles() {
    await this.prisma.role.createMany({
      data: [
        { id: 1, name: 'USER' },
        { id: 2, name: 'ADMIN' },
      ],
      skipDuplicates: true,
    });
    console.log('Roles seeded.');
  }

  async createAdmin() {
    const isAdminExist = await this.prisma.user.findUnique({
      where: {
        email: 'admin@admin.com',
      },
    });
    if (isAdminExist) {
      console.log('Admin already exist!');
      return;
    }

    const hashedPassword = await bcrypt.hash('adminadmin', 10);

    await this.prisma.user.create({
      data: {
        email: 'admin@admin.com',
        password: hashedPassword,
        roleId: 2,
      },
    });
    console.log('Admin was created!');
  }
}
