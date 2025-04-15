import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from './dto/user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(
    @Body() createAuthDto: UserDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, refreshToken } = await this.authService.login(createAuthDto);
    res.cookie('refreshToken', refreshToken, { maxAge: 864000000 });
    return { token };
  }

  @Post('signUp')
  @UsePipes(ValidationPipe)
  async signUp(@Body() userDto: UserDTO): Promise<string> {
    return await this.authService.signUp(userDto);
  }
}
