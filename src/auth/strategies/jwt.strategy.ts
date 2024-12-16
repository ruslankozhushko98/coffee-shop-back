import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ENV_VARS } from 'src/utils/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { Payload } from 'src/auth/utils/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get(ENV_VARS.SECRET_KEY),
    });
  }

  async validate({ userId }: Payload) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    delete user.password;

    return user;
  }
}
