import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';

import { User } from 'src/auth/entities';
import { BeverageOpts } from './utils/types';
import { ToggleFavoriteDto, UpdateBeverageDto } from './dto';
import { Beverage } from './entities';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Beverage)
    private readonly beverageRepository: Repository<Beverage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public getAllMenu(title?: string): Promise<Array<BeverageOpts>> {
    return this.beverageRepository.find({
      where: {
        title: Like(`%${title}%`),
      },
      select: {
        id: true,
        title: true,
        price: true,
      },
    });
  }

  public getFavoriteBeverages(userId: number): Promise<Array<Beverage>> {
    return this.beverageRepository.find({
      where: {
        usersWhoLiked: {
          id: userId,
        },
      },
    });
  }

  public async getBeverageById(
    host: string,
    beverageId: number,
    userId?: number,
  ): Promise<Beverage & { isFavorite: boolean }> {
    const beverage = await this.beverageRepository.findOne({
      where: {
        id: beverageId,
      },
    });

    let favoriteBeverage: Beverage | null = null;

    if (Boolean(userId)) {
      favoriteBeverage = await this.beverageRepository.findOne({
        where: {
          id: beverageId,
        },
      });
    }

    return {
      ...beverage,
      imgUrl: `${host}/assets/${beverage.title}.jpeg`,
      isFavorite: Boolean(
        favoriteBeverage?.usersWhoLiked?.some((item) => item?.id === userId),
      ),
    };
  }

  public async updateBeverage(
    beverageId: number,
    dto: UpdateBeverageDto,
  ): Promise<Beverage> {
    await this.beverageRepository.update({ id: beverageId }, dto);

    return this.beverageRepository.findOne({
      where: { id: beverageId },
    });
  }

  public async toggleFavorite({
    beverageId,
    userId,
  }: ToggleFavoriteDto): Promise<FavoriteBeverages> {
    const beverage = await this.beverageRepository.findOne({
      where: {
        id: beverageId,
        usersWhoLiked: { id: userId },
      },
    });

    if (beverage) {
      await this.beverageRepository
        .createQueryBuilder()
        .relation(User, 'favoriteBeverages')
        .of(userId)
        .remove(beverageId);
    }

    const beverageCreated = this.beverageRepository.create({
      data: {
        beverageId,
        userId,
      },
    });
  }
}
