import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

import { ENV_VARS } from 'src/utils/constants';
import { EmailDto } from './dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: false,
      port: 8081,
      auth: {
        user: config.get(ENV_VARS.EMAIL_USER),
        pass: config.get(ENV_VARS.EMAIL_PASSWORD),
      },
    });
  }

  public async sendEmail({
    to,
    subject,
    text,
  }: EmailDto): Promise<{ message: string }> {
    const mailOptions = {
      from: this.config.get(ENV_VARS.EMAIL_USER),
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
