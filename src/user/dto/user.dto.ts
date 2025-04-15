import { IsString, IsEmail, MinLength } from 'class-validator';

export class UserDTO {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;
}
