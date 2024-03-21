import { Injectable } from '@nestjs/common';
import { Beverage } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { ToggleFavoriteDto, UpdateBeverageDto } from './dto';

@Injectable()
export class MenuService {
  constructor(private prismaService: PrismaService) {}

  public getAllMenu(title?: string): Promise<Array<Beverage>> {
    if (title) {
      return this.prismaService.beverage.findMany({
        where: {
          title: {
            contains: title,
          },
        },
      });
    }

    return this.prismaService.beverage.findMany();
  }

  public getBeverageById(beverageId: number): Promise<Beverage> {
    return this.prismaService.beverage.findFirst({
      where: {
        id: beverageId,
      },
    });
  }

  public updateBeverage(
    beverageId: number,
    dto: UpdateBeverageDto,
  ): Promise<Beverage> {
    return this.prismaService.beverage.update({
      where: {
        id: beverageId,
      },
      data: dto,
    });
  }

  public async toggleFavorite({ beverageId, userId }: ToggleFavoriteDto) {
    const beverage = await this.prismaService.favoriteBeverages.findFirst({
      where: {
        beverageId,
        userId,
      },
    });

    if (beverage) {
      return this.prismaService.favoriteBeverages.delete({
        where: {
          beverageId_userId: {
            beverageId,
            userId,
          },
        },
      });
    }

    return this.prismaService.favoriteBeverages.create({
      data: {
        beverageId,
        userId,
      },
    });
  }
}
