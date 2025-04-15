import { Controller, Get, Req, Res } from '@nestjs/common';
import { TokenService } from './token.service';
import { AuthRequest } from 'src/user/types/user';
import { Response } from 'express';

@Controller()
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('refresh-token')
  async getRefreshToken(
    @Req() request: AuthRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, newRefreshToken } = await this.tokenService.updateTokens(
      request.cookies['refreshToken'],
    );
    res.cookie('refreshToken', newRefreshToken, { maxAge: 864000000 });
    return { accessToken: token };
  }
}
