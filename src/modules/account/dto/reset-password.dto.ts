import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

import { PasswordMatches } from 'src/common/decorators';

export class ResetPasswordDto {
  @IsNumber()
  @IsNotEmpty({ message: 'userId is required!' })
  userId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Token is required!' })
  resetToken: string;

  @IsString()
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  @IsNotEmpty({ message: 'Password is required!' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Password confirmation is required!' })
  @PasswordMatches('password', { message: 'Password does not match!' })
  confirmPassword: string;
}
