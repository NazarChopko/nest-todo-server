import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenDTO } from './dto/tokenDTO';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  async generateAccessToken({
    email,
    id,
    role,
  }: TokenDTO): Promise<{ token: string }> {
    const token = await this.jwtService.signAsync(
      { email, id, role },
      {
        secret: this.config.get<string>('secretKey'),
        expiresIn: '5h',
      },
    );

    return { token };
  }

  async generateRefreshToken({
    email,
    id,
    role,
  }: TokenDTO): Promise<{ token: string }> {
    const token = await this.jwtService.signAsync(
      { email, id, role },
      {
        secret: this.config.get<string>('secretKey'),
        expiresIn: '7d',
      },
    );

    return { token };
  }

  async updateTokens(
    refreshToken: string,
  ): Promise<{ token: string; newRefreshToken: string }> {
    if (!refreshToken) {
      throw new InternalServerErrorException('No refresh token');
    }
    const payload = (await this.jwtService.verifyAsync(refreshToken, {
      secret: this.config.get<string>('secretKey'),
    })) as TokenDTO | undefined | null;

    if (!payload) {
      throw new InternalServerErrorException('Invalid refresh token');
    }

    const { token } = await this.generateAccessToken(payload);
    const { token: newRefreshToken } = await this.generateRefreshToken(payload);

    return { token, newRefreshToken };
  }
}
