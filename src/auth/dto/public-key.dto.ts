import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PublicKeyDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  key: string;
}
