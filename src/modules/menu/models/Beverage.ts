import { Beverage } from '@prisma/client';

export interface IBeverage extends Beverage {
  isFavorite: boolean;
}
