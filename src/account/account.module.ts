import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailService } from 'src/email/email.service';
import { OTC, Token, User } from 'src/auth/entities';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OTC, User, Token])],
  providers: [AccountService, EmailService],
  controllers: [AccountController],
})
export class AccountModule {}
