import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
          return `${timestamp as any} [${level.toUpperCase()}]: ${message as any}`;
        }),
      ),
      transports: [
        new winston.transports.DailyRotateFile({
          filename: 'logs/application-%DATE%.log', // Кожного дня новий файл
          datePattern: 'YYYY-MM-DD',
          maxFiles: '7d', // Зберігати логи тільки за останні 7 днів
          zippedArchive: true, // Архівувати старі логи
        }),
        new winston.transports.Console(), // Вивід в консоль
      ],
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const userAgent = req.get('User-Agent') || 'Unknown';
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const logMessage = `${method} ${originalUrl} ${res.statusCode} - ${duration}ms [${userAgent}]`;

      this.logger.info(logMessage);
    });

    next();
  }
}
