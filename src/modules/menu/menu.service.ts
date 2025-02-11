import { Injectable } from '@nestjs/common';
import { Beverage, FavoriteBeverages } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { BeverageOpts } from './utils/types';
import { CreateBeverageDto, ToggleFavoriteDto, UpdateBeverageDto } from './dto';
import { IBeverage } from './models';

@Injectable()
export class MenuService {
  constructor(private readonly prismaService: PrismaService) {}

  public getAllMenu(title?: string): Promise<Array<BeverageOpts>> {
    return this.prismaService.beverage.findMany({
      where: {
        title: {
          contains: title,
        },
      },
      select: {
        id: true,
        title: true,
        price: true,
      },
    });
  }

  public async getFavoriteBeverages(userId: number) {
    const beverages = await this.prismaService.beverage.findMany({
      include: {
        favoriteBeverages: {
          where: {
            userId,
          },
          select: {
            beverageId: true,
          },
        },
      },
    });

    return beverages
      .filter((beverage) => beverage.favoriteBeverages.length !== 0)
      .map((beverage) => ({
        id: beverage.id,
        title: beverage.title,
        price: beverage.price,
        isFavorite: beverage.favoriteBeverages.length !== 0,
      }));
  }

  public async getBeverageById(
    host: string,
    beverageId: number,
    userId?: number,
  ): Promise<IBeverage> {
    const beverage = await this.prismaService.beverage.findFirst({
      where: {
        id: beverageId,
      },
    });

    let favoriteBeverage = null;

    if (Boolean(userId)) {
      favoriteBeverage = await this.prismaService.favoriteBeverages.findFirst({
        where: {
          beverageId,
          userId,
        },
      });
    }

    return {
      ...beverage,
      imgUrl: `${host}/assets/${beverage.title}.jpeg`,
      isFavorite: Boolean(favoriteBeverage),
    };
  }

  public createBeverage(dto: CreateBeverageDto): Promise<Beverage> {
    return this.prismaService.beverage.create({ data: dto });
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

  public async toggleFavorite({
    beverageId,
    userId,
  }: ToggleFavoriteDto): Promise<FavoriteBeverages> {
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
