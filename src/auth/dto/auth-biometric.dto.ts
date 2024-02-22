import { IsNotEmpty, IsString } from 'class-validator';

export class AuthBiometricDto {
  @IsString()
  @IsNotEmpty()
  signature: string;

  @IsString()
  @IsNotEmpty()
  payload: string;
}
