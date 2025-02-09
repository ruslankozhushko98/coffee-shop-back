import { GENDER } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignUpDto {
  @IsEmail(null, { message: 'Email is invalid!' })
  @IsString()
  @IsNotEmpty({ message: 'Email is required!' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required!' })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
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
