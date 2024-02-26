import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OneTimeCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
