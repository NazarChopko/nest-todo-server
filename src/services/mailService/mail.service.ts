import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import handlebars from 'nodemailer-express-handlebars';
import * as path from 'path';

@Injectable()
export class MailService {
  transporter: nodemailer.Transporter;
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: this.configService.get<number>('smtpPort'),
      secure: false,
      auth: {
        user: this.configService.get<string>('smtpUser'),
        pass: this.configService.get<string>('smtpPassword'),
      },
    });

    this.transporter.use(
      'compile',
      handlebars({
        viewEngine: {
          extname: '.hbs',
          partialsDir: path.resolve('views'),
          defaultLayout: false,
        },
        viewPath: path.resolve('views'),
        extName: '.hbs',
      }),
    );
  }

  async sendMail(
    to: string,
    subject: string,
    template: string,
    context: object,
  ) {
    const mailOptions = {
      from: this.configService.getOrThrow<string>('smtpUser'),
      to,
      subject,
      template,
      context,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Email sending error');
    }
  }
}
