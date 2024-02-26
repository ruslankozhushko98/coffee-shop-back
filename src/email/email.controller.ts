import { Body, Controller, Post } from '@nestjs/common';

import { EmailDto } from './dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post('/send')
  public sendEmail(@Body() body: EmailDto) {
    return this.emailService.sendEmail(body);
  }
}
