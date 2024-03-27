import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { EditProfileDto } from './dto';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}

  public editProfile(dto: EditProfileDto): Promise<User> {
    return this.prismaService.user.update({
      where: {
        id: dto.id,
      },
      data: dto,
    });
  }
}
