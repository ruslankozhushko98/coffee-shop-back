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
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { OTC_DURATION, OTC_LENGTH } from './utils/constants';
import { OneTimeCodeDto, ResetPasswordDto } from './dto';

@Injectable()
export class AccountService {
  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
  ) {}

  public async createOTC(userId: number) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const otcRemoved = await this.prismaService.oneTimeCode.deleteMany({
      where: {
        userId,
      },
    });

    const code = generateOTC(OTC_LENGTH);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const otc = await this.prismaService.oneTimeCode.create({
      data: {
        userId,
        code,
        expiresAt: dayjs().add(OTC_DURATION, 'minutes').toDate(),
      },
      include: {
        user: true,
      },
    });

    await this.emailService.sendEmail({
      to: otc.user.email,
      subject: 'CoffeeShop Account Verification',
      text: `Your verification code is: ${code}. This is a sensitive information, so don't tell it anybody!`,
    });

    return {
      message: 'One-time code successfully created and sent to the email',
    };
  }

  public async activateAccount(userId: number, code: string) {
    const otc = await this.prismaService.oneTimeCode.findFirst({
      where: {
        userId,
        code,
      },
    });

    if (!otc) {
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
    const otcDeleted = await this.prismaService.oneTimeCode.delete({
      where: {
        id: otc.id,
      },
    });

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

    await this.prismaService.oneTimeCode.deleteMany({
      where: {
        userId: user.id,
      },
    });

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
    await this.prismaService.token.deleteMany({
      where: {
        id: userId,
      },
    });

    const otc = await this.prismaService.oneTimeCode.findFirst({
      where: {
        code,
        userId,
      },
    });

    if (!otc) {
      throw new NotFoundException('Invalid one-time code');
    }

    const isOTCExpired: boolean = checkIsOTCExpired(otc.expiresAt);

    if (isOTCExpired) {
      throw new NotFoundException('One-time code is expired');
    }

    const hex: string = crypto.randomBytes(64).toString('hex');
    const token: string = await argon.hash(hex);

    await this.prismaService.token.create({
      data: {
        userId,
        token,
      },
    });

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
    const { token } = await this.prismaService.token.findFirst({
      where: {
        userId,
      },
    });

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
