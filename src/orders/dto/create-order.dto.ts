import { BEVERAGE_TYPES, SIZES } from '@prisma/client';
import { IsArray, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

export class BeveragesOnOrderDto {
  @IsNumber()
  @IsNotEmpty()
  beverageId: number;

  @IsEnum(SIZES)
  size: SIZES;

  @IsEnum(BEVERAGE_TYPES)
  @IsNotEmpty()
  type: BEVERAGE_TYPES;

  @IsNumber()
  amount: number;
}

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsArray()
  @IsNotEmpty()
  beverages: Array<BeveragesOnOrderDto>;
}
