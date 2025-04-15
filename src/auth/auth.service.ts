import {
  Injectable,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';

import { UserDTO } from './dto/user.dto';
import { TokenService } from 'src/token/token.service';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}
  async login(
    userDTO: UserDTO,
  ): Promise<{ token: string; refreshToken: string }> {
    const user = await this.userService.getUser(userDTO.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      userDTO.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password or email is not valid!');
    }

    const {
      email,
      id,
      role: { name },
    } = user;

    const { token } = await this.tokenService.generateAccessToken({
      email,
      id,
      role: name,
    });
    const { token: refreshToken } =
      await this.tokenService.generateRefreshToken({
        email,
        id,
        role: name,
      });
    return { token, refreshToken };
  }

  async signUp(userDto: UserDTO): Promise<string> {
    const { email, password } = userDto;
    const isUserExist = await this.userService.getUser(userDto.email);

    if (isUserExist) {
      throw new BadRequestException('User already exist!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userService.createUser({
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      throw new InternalServerErrorException('Error when creating user');
    }

    return 'User was created';
  }
}
