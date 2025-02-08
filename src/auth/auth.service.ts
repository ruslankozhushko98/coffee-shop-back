import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';
import crypto from 'crypto';
import { Repository } from 'typeorm';

import { ENV_VARS, Gender } from 'src/utils/constants';
import { AccountService } from 'src/account/account.service';
import { AuthObj, Payload } from './utils/types';
import { SignInDto, SignUpDto, PublicKeyDto, AuthBiometricDto } from './dto';
import { User } from './entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly accountService: AccountService,
  ) {}

  public async signIn(signInDto: SignInDto): Promise<AuthObj> {
    const user = await this.usersRepository.findOne({
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

    if (!user.isActivated) {
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

  public async signUp(
    signUpDto: SignUpDto,
  ): Promise<Pick<AuthObj, 'accessToken'>> {
    const user = await this.usersRepository.findOne({
      where: {
        email: signUpDto.email,
      },
    });

    if (user) {
      throw new ForbiddenException('User with such email does already exist!');
    }

    const passwordHash: string = await argon2.hash(signUpDto.password);

    const newUser = this.usersRepository.create({
      ...signUpDto,
      gender: signUpDto.gender as Gender,
      password: passwordHash,
    });

    const userSaved = await this.usersRepository.save(newUser);

    const accessToken = await this.signToken({
      userId: userSaved.id,
      email: userSaved.email,
    });

    return { accessToken };
  }

  public signToken(payload: Payload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.get(ENV_VARS.SECRET_KEY),
    });
  }

  public async getMe(
    userId: number,
  ): Promise<Omit<User, 'password' | 'publicKey'>> {
    const user = await this.usersRepository.findOne({
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
    const res = await this.usersRepository.update(
      {
        id: userId,
      },
      { publicKey: key },
    );

    return {
      message: 'Key stored successfully',
    };
  }

  public async authBiometric({
    signature,
    payload,
  }: AuthBiometricDto): Promise<AuthObj> {
    const userId = Number(payload.split('__')[0]);

    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ForbiddenException('Biometric authentication failed!');
    }

    const verifier = crypto.createVerify('RSA-SHA256');

    verifier.update(payload);

    const isActivated = verifier.verify(
      `-----BEGIN PUBLIC KEY-----\n${user.publicKey}\n-----END PUBLIC KEY-----`,
      signature,
      'base64',
    );

    if (!isActivated) {
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
