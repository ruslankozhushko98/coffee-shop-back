import { Injectable, NotFoundException } from '@nestjs/common';
import * as dayjs from 'dayjs';

import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { checkIsOTCExpired, generateOTC } from 'src/utils/helpers';
import { OTC_DURATION, OTC_LENGTH } from './utils/constants';

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
      message: 'OTC successfully created and sent to the email',
    };
  }

  public async verifyAccount(userId: number, code: string) {
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
        isVerified: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const otcDeleted = await this.prismaService.oneTimeCode.delete({
      where: {
        id: otc.id,
      },
    });

    return {
      message: 'Account verified successfully!',
    };
  }
}
