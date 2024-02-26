import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { ConfigService } from '@nestjs/config';

import { EmailDto } from './dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      port: 8081,
      auth: {
        user: config.get('EMAIL_USER'),
        pass: config.get('EMAIL_PASSWORD'),
      },
    });
  }

  public async sendEmail({
    to,
    subject,
    text,
  }: EmailDto): Promise<{ message: string }> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);

    return {
      message: 'Email successfully sent',
    };
  }
}
