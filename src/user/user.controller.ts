import {
  Controller,
  Get,
  UseGuards,
  Req,
  Param,
  Res,
  Header,
  Body,
  UploadedFile,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import * as archiver from 'archiver';
import { Readable } from 'stream';

import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { AuthRequest, UserProfile } from './types/user';
import { createReadStream, stat } from 'fs';
import { join } from 'path';
import { Response, Request } from 'express';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('current-user')
  async getProfile(@Req() request: AuthRequest): Promise<UserProfile | null> {
    return this.userService.getAccount(request.user.email);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @Post('user/set-avatar')
  updateUser(
    @Req() request: AuthRequest,
    @Body() user: { userName: string; address: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateUser(request.user.id, user, file);
  }

  @Get('video')
  getVideos(@Req() req: Request, @Res() res: Response) {
    const videoPath = join(__dirname, '../../public', 'video.mp4');

    stat(videoPath, (err, stats) => {
      if (err) {
        return res.status(404).send('Video not found');
      }

      const range = req.headers.range;
      if (!range) {
        res.status(400).send('Range header required');
        return;
      }

      const videoSize = stats.size;
      const CHUNK_SIZE = 10 ** 6; // 1MB
      const start = Number(range.replace(/\D/g, ''));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

      const videoStream = createReadStream(videoPath, { start, end });

      res.setHeader('Content-Range', `bytes ${start}-${end}/${videoSize}`);
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', end - start + 1);
      res.setHeader('Content-Type', 'video/mp4');

      videoStream.pipe(res);

      videoStream.on('error', (err) => {
        res.status(500).send('Error streaming video');
      });
    });
  }

  @Header('Content-Disposition', `attachment; filename="zipFile.zip"`)
  @Header('Content-Type', 'application/zip')
  @Roles('ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('download/:filename')
  async getFileFromS3(
    @Param('filename') fileName: string,
    @Res() res: Response,
  ) {
    const { Body } = await this.userService.downloadFile(fileName);

    if (!Body) {
      res.status(404).send('Stream doesnt exist');
      return;
    }
    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.pipe(res);
    archive.append(Body as Readable, { name: fileName });
    archive.finalize();
  }
}
