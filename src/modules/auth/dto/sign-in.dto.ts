import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class SignInDto {
  @IsEmail(null, { message: 'Email is invalid!' })
  @IsString()
  @IsNotEmpty({ message: 'Email is required!' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required!' })
  @Min(6)
  password: string;
}
