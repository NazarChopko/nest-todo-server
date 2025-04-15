import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { todoDTO } from './dto/todoDTO';
import { PrismaService } from 'src/services/prismaClient/prisma.service';
import { MailService } from 'src/services/mailService/mail.service';

@Injectable()
export class TodoService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}
  async create(userId: number, todoDTO: todoDTO) {
    const todo = await this.prismaService.todo.create({
      data: {
        text: todoDTO.text,
        isCompleted: todoDTO.isCompleted,
        id: todoDTO.id,
        userId,
      },
    });
    if (!todo)
      throw new InternalServerErrorException(
        'Something went wrong in db when creating!',
      );

    try {
      await this.mailService.sendMail(
        'nazarchopko.business@gmail.com',
        'test',
        'welcome',
        {
          name: { firstName: 'Nazarchopko' },
          id: '1',
          project_name: 'UkraineNow',
          company_name: 'UkraineNow',
          date: new Date().toDateString(),
        },
      );
    } catch (error) {
      throw new InternalServerErrorException('Something went wrong in mail!');
    }
    return this.getAllTodos(userId);
  }

  async getAllTodos(userId: number) {
    return this.prismaService.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllTodosServer() {
    return this.prismaService.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTodoById(todoId: string) {
    return this.prismaService.todo.findUnique({
      where: { id: todoId },
    });
  }

  async updateTodo(id: string, userId: number) {
    const findUniqueTodo = await this.prismaService.todo.findUnique({
      where: { id, userId },
    });
    if (!findUniqueTodo)
      throw new InternalServerErrorException('Todo not found!');
    const updatedTodo = {
      ...findUniqueTodo,
      isCompleted: !findUniqueTodo.isCompleted,
    };
    const updateTodo = await this.prismaService.todo.update({
      where: { id, userId },
      data: { ...updatedTodo },
    });
    if (!updateTodo) throw new InternalServerErrorException('Todo not found!');
    return this.getAllTodos(userId);
  }

  async deleteTodo(id: string, userId: number) {
    const deletedTodo = await this.prismaService.todo.delete({
      where: { id },
    });
    if (!deletedTodo) throw new InternalServerErrorException('Todo not found!');

    return this.getAllTodos(userId);
  }
}
