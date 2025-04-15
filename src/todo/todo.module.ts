import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { PrismaService } from 'src/services/prismaClient/prisma.service';
import { MailService } from 'src/services/mailService/mail.service';

@Module({
  controllers: [TodoController],
  providers: [TodoService, PrismaService, MailService],
})
export class TodoModule {}
