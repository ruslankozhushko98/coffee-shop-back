import { GENDER } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class SignUpDto {
  @IsEmail(null, { message: 'Email is invalid!' })
  @IsString()
  @IsNotEmpty({ message: 'Email is required!' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required!' })
  @Min(6)
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'First name is required!' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'Last name is required!' })
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'Date of birth is required!' })
  dob: string;

  @IsString()
  gender: GENDER;
}
