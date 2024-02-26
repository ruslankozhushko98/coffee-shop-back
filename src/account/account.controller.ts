import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AccountService } from './account.service';

@UseGuards(AuthGuard('jwt'))
@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @Post('create-otc')
  public async createOTC(@Body() body: { userId: number }) {
    return this.accountService.createOTC(body.userId);
  }

  @Post('email/verify')
  public async verifyAccount(@Body() body: { code: string }, @Req() req) {
    return this.accountService.verifyAccount(req.user.id, body.code);
  }
}
