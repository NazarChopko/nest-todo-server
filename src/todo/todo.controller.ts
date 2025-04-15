import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { todoDTO } from './dto/todoDTO';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AuthRequest } from 'src/user/types/user';

@Controller()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @UseGuards(JwtAuthGuard)
  @Post('add-todo')
  createTodo(@Body() todoDTO: todoDTO, @Req() req: AuthRequest) {
    return this.todoService.create(req.user.id, todoDTO);
  }
  @UseGuards(JwtAuthGuard)
  @Get('get-todos')
  getTodos(@Req() req: AuthRequest) {
    return this.todoService.getAllTodos(req.user.id);
  }

  @Get('get-todo/:id')
  getTodo(@Param('id') todoId: string) {
    return this.todoService.getTodoById(todoId);
  }

  @Get('get-all-todos')
  getServerTodos() {
    return this.todoService.getAllTodosServer();
  }
  @UseGuards(JwtAuthGuard)
  @Patch('update-todo/:id')
  updateTodo(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.todoService.updateTodo(id, req.user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('delete-todo/:id')
  deleteTodo(@Param('id') id: string, @Req() req: AuthRequest) {
    return this.todoService.deleteTodo(id, req.user.id);
  }
}
