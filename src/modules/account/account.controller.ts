import { Body, Controller, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AccountService } from './account.service';
import { OneTimeCodeDto, ResetPasswordDto } from './dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create-otc')
  public createOTC(@Body() body: { userId: number }) {
    return this.accountService.createOTC(body.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('email/activate')
  public activateAccount(@Body() body: { code: string }, @Req() req) {
    return this.accountService.activateAccount(req.user.id, body.code);
  }

  @Post('email/verify')
  public verifyAccount(@Body() body: OneTimeCodeDto) {
    return this.accountService.verifyAccount(body);
  }

  @Post('check-user')
  public checkUser(@Body() body: { email: string }) {
    return this.accountService.checkUser(body.email);
  }

  @Put('reset-password')
  public resetPassword(@Body() body: ResetPasswordDto) {
    return this.accountService.resetPassword(body);
  }
}
