import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateBeverageDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Id is required!' })
  id: number;

  @IsString()
  @IsNotEmpty({ message: 'Title is required!' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Title is required!' })
  descriptions: string;
}
