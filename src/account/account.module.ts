import { Module } from '@nestjs/common';

import { EmailService } from 'src/email/email.service';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

@Module({
  providers: [AccountService, EmailService],
  controllers: [AccountController],
})
export class AccountModule {}
