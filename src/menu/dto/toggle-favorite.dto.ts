import { IsNotEmpty, IsNumber } from 'class-validator';

export class ToggleFavoriteDto {
  @IsNumber()
  @IsNotEmpty({ message: 'beverageId is required!' })
  beverageId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'userId is required!' })
  userId: number;
}
