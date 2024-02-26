import { IsNotEmpty, IsString } from 'class-validator';

export class EmailDto {
  @IsString()
  @IsNotEmpty()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
