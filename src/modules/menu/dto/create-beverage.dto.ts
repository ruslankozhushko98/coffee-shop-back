import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateBeverageDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsString()
  imgUrl: string;

  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @Min(1)
  starsCount: number;
}
