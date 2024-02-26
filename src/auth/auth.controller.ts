import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthBiometricDto, PublicKeyDto, SignInDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  public signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('sign-up')
  public signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  public getMe(@Req() req) {
    return this.authService.getMe(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/create-public-key')
  public createPublicKey(@Body() body: PublicKeyDto) {
    return this.authService.createPublicKey(body);
  }

  @Post('/auth-biometric')
  public authBiometric(@Body() body: AuthBiometricDto) {
    return this.authService.authBiometric(body);
  }
}
