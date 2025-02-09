import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as crypto from 'crypto';
import * as argon from 'argon2';
import { User } from '@prisma/client';

import { checkIsOTCExpired, generateOTC } from 'src/utils/helpers';
import { RedisService } from 'src/redis/redis.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/modules/email/email.service';
import { OTC_DURATION, OTC_LENGTH } from './utils/constants';
import { OneTimeCodeDto, ResetPasswordDto } from './dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly redisService: RedisService,
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  public async createOTC(userId: number) {
    await this.redisService.delete(`otc-${userId}`);

    const code = generateOTC(OTC_LENGTH);

    await this.redisService.set(
      `otc-${userId}`,
      JSON.stringify({
        userId,
        code,
        expiresAt: dayjs().add(OTC_DURATION, 'minutes').toDate(),
      }),
    );

    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
    });

    await this.emailService.sendEmail({
      to: user.email,
      subject: 'CoffeeShop Account Verification',
      text: `Your verification code is: ${code}. This is a sensitive information, so don't tell it anybody!`,
    });

    return {
      message: 'One-time code successfully created and sent to the email',
    };
  }

  public async activateAccount(userId: number, code: string) {
    const otc = JSON.parse(await this.redisService.get(`otc-${userId}`));

    if (!otc || otc.code !== code) {
      throw new NotFoundException('Invalid one-time code');
    }

    const isOTCExpired: boolean = checkIsOTCExpired(otc.expiresAt);

    if (isOTCExpired) {
      throw new NotFoundException('One-time code is expired');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        isActivated: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const otcDeleted = await this.redisService.delete(`otc-${userId}`);

    return {
      message: 'Account activated successfully!',
    };
  }

  public async checkUser(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User with such email does not exist!');
    }

    await this.redisService.delete(`otc-${user.id}`);

    const { message } = await this.createOTC(user.id);

    return {
      message,
      userId: user.id,
    };
  }

  public async verifyAccount({
    code,
    userId,
  }: OneTimeCodeDto): Promise<{ userId: number; token: string }> {
    await this.redisService.delete(`token-${userId}`);

    const otc = JSON.parse(await this.redisService.get(`otc-${userId}`));

    if (!otc || otc.code !== code) {
      throw new NotFoundException('Invalid one-time code');
    }

    const isOTCExpired: boolean = checkIsOTCExpired(otc.expiresAt);

    if (isOTCExpired) {
      throw new NotFoundException('One-time code is expired');
    }

    const hex: string = crypto.randomBytes(64).toString('hex');
    const token: string = await argon.hash(hex);

    await this.redisService.set(`token-${userId}`, token);

    return {
      token,
      userId,
    };
  }

  public async resetPassword({
    userId,
    resetToken,
    password,
  }: ResetPasswordDto): Promise<User> {
    const token = await this.redisService.get(`token-${userId}`);

    if (token !== resetToken) {
      throw new ForbiddenException('Invalid token!');
    }

    const passwordHash: string = await argon.hash(password);

    return this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: passwordHash,
      },
    });
  }
}
