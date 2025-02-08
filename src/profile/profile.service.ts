import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { EditProfileDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  public async editProfile(dto: EditProfileDto): Promise<User> {
    const user = await this.prismaService.user.update({
      where: {
        id: dto.id,
      },
      data: dto,
    });

    delete user.password;

    return user;
  }
}
