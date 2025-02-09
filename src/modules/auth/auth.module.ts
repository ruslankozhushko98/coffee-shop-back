import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AccountService } from 'src/modules/account/account.service';
import { EmailService } from 'src/modules/email/email.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    JwtModule.register({
      signOptions: {
        expiresIn: '6h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AccountService, EmailService],
})
export class AuthModule {}
