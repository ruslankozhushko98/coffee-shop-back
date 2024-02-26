import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';
import * as crypto from 'crypto';

import { PrismaService } from 'src/prisma/prisma.service';
import { AccountService } from 'src/account/account.service';
import { AuthObj, Payload } from './utils/types';
import { SignInDto, SignUpDto, PublicKeyDto, AuthBiometricDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private accountService: AccountService,
  ) {}

  public async signIn(signInDto: SignInDto): Promise<AuthObj> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: signInDto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Wrong email or password!');
    }

    const isPasswordValid: boolean = await argon2.verify(
      user.password,
      signInDto.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Wrong email or password!');
    }

    if (!user.isVerified) {
      await this.accountService.createOTC(user.id);
    }

    const accessToken = await this.signToken({
      userId: user.id,
      email: user.email,
    });

    delete user.password;
    delete user.publicKey;

    return {
      accessToken,
      user,
    };
  }

  public async signUp(signUpDto: SignUpDto): Promise<{ accessToken: string }> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: signUpDto.email,
      },
    });

    if (user) {
      throw new ForbiddenException('User with such email does already exist!');
    }

    const passwordHash: string = await argon2.hash(signUpDto.password);

    const newUser = await this.prismaService.user.create({
      data: {
        ...signUpDto,
        password: passwordHash,
      },
    });

    const accessToken = await this.signToken({
      userId: newUser.id,
      email: newUser.email,
    });

    return { accessToken };
  }

  public signToken(payload: Payload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.get('SECRET_KEY'),
    });
  }

  public async getMe(
    userId: number,
  ): Promise<Omit<User, 'password' | 'publicKey'>> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    delete user.password;
    delete user.publicKey;

    return user;
  }

  public async createPublicKey({
    userId,
    key,
  }: PublicKeyDto): Promise<{ message: string }> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const res = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        publicKey: key,
      },
    });

    return {
      message: 'Key stored successfully',
    };
  }

  public async authBiometric({
    signature,
    payload,
  }: AuthBiometricDto): Promise<AuthObj> {
    const userId = Number(payload.split('__')[0]);

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('Biometric authentication failed!');
    }

    const verifier = crypto.createVerify('RSA-SHA256');

    verifier.update(payload);

    const isVerified = verifier.verify(
      `-----BEGIN PUBLIC KEY-----\n${user.publicKey}\n-----END PUBLIC KEY-----`,
      signature,
      'base64',
    );

    if (!isVerified) {
      throw new ForbiddenException(
        'Unfortunately your biometric cannot be verified!',
      );
    }

    const accessToken = await this.signToken({
      userId: user.id,
      email: user.email,
    });

    delete user.password;
    delete user.publicKey;

    return {
      accessToken,
      user,
    };
  }
}
