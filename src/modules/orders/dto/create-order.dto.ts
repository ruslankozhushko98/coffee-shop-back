import { BEVERAGE_TYPES, SIZES } from '@prisma/client';
import {
  IsArray,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

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
  qty: number;

  @IsNumber()
  @IsNotEmpty()
  starsCount: number;
}

export class CreateOrderDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @IsArray()
  @IsNotEmpty()
  beverages: Array<BeveragesOnOrderDto>;

  @IsNumber()
  @IsNotEmpty()
  starsCount: number;

  @IsString()
  @IsNotEmpty()
  additionally: string;
}
