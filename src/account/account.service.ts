import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import dayjs from 'dayjs';
import crypto from 'crypto';
import argon from 'argon2';
import { Repository } from 'typeorm';

import { checkIsOTCExpired, generateOTC } from 'src/utils/helpers';
import { EmailService } from 'src/email/email.service';
import { OTC, Token, User } from 'src/auth/entities';
import { OTC_DURATION, OTC_LENGTH } from './utils/constants';
import { OneTimeCodeDto, ResetPasswordDto } from './dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(OTC)
    private readonly otcRepository: Repository<OTC>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly emailService: EmailService,
  ) {}

  public async createOTC(userId: number) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const otcRemoved = await this.otcRepository.delete({
      user: { id: userId },
    });

    const code = generateOTC(OTC_LENGTH);

    const otcCreated = this.otcRepository.create({
      user: {
        id: userId,
      },
      code,
      expiresAt: dayjs().add(OTC_DURATION, 'minutes').toDate().toString(),
    });

    await this.otcRepository.save(otcCreated);

    const otc = await this.otcRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'],
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
    const otc = await this.otcRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        code,
      },
    });

    if (!otc) {
      throw new NotFoundException('Invalid one-time code');
    }

    const isOTCExpired: boolean = checkIsOTCExpired(new Date(otc.expiresAt));

    if (isOTCExpired) {
      throw new NotFoundException('One-time code is expired');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await this.userRepository.update(
      { id: userId },
      { isActivated: true },
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const otcDeleted = await this.otcRepository.delete({
      id: otc.id,
    });

    return {
      message: 'Account activated successfully!',
    };
  }

  public async checkUser(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new NotFoundException('User with such email does not exist!');
    }

    await this.otcRepository.delete({
      user: { id: user.id },
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
    await this.tokenRepository.delete({
      user: {
        id: userId,
      },
    });

    const otc = await this.otcRepository.findOne({
      where: {
        code,
        user: { id: userId },
      },
    });

    if (!otc) {
      throw new NotFoundException('Invalid one-time code');
    }

    const isOTCExpired: boolean = checkIsOTCExpired(new Date(otc.expiresAt));

    if (isOTCExpired) {
      throw new NotFoundException('One-time code is expired');
    }

    const hex: string = crypto.randomBytes(64).toString('hex');
    const token: string = await argon.hash(hex);

    const tokenCreated = this.tokenRepository.create({
      user: { id: userId },
      token,
    });

    await this.tokenRepository.save(tokenCreated);

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
    const { token } = await this.tokenRepository.findOne({
      where: {
        user: { id: userId },
      },
    });

    if (token !== resetToken) {
      throw new ForbiddenException('Invalid token!');
    }

    const passwordHash: string = await argon.hash(password);

    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    updatedUser.password = passwordHash;

    const user = await this.userRepository.save(updatedUser);

    await this.tokenRepository.delete({
      user: { id: userId },
    });

    return user;
  }
}
