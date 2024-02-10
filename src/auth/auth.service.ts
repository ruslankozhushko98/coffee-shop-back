import { ConfigService } from '@nestjs/config';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { AccessTokenObj, Payload } from './utils/types';
import { SignInDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  public async signIn(signInDto: SignInDto): Promise<AccessTokenObj> {
    const user = await this.prismaService.user.findUnique({
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

    return this.signToken({ userId: user.id, email: user.email });
  }

  public async signUp(signUpDto: SignUpDto): Promise<AccessTokenObj> {
    const user = await this.prismaService.user.findUnique({
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

    return this.signToken({ userId: newUser.id, email: newUser.email });
  }

  public async signToken(payload: Payload): Promise<AccessTokenObj> {
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get('SECRET_KEY'),
    });

    return { accessToken };
  }

  public async getMe(userId: number): Promise<Omit<User, 'password'>> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    delete user.password;

    return user;
  }
}
