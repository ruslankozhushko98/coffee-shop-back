import { GENDER } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, Matches, Min } from 'class-validator';

import { PASSWORD_REGEX } from 'src/auth/utils/constants';

export class SignUpDto {
  @IsEmail(null, { message: 'Email is invalid!' })
  @IsString()
  @IsNotEmpty({ message: 'Email is required!' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required!' })
  @Min(8)
  @Matches(PASSWORD_REGEX, {
    message: `
      Password must contain:
      1. Upper-case letters;
      2. Lower-case letters;
      3. Special characters;
      4. Numbers;
      5. Length must be at least 8 characters;
    `,
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
