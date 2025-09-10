import { IsEmail, IsString, MinLength } from 'class-validator';
import { ISignInRequest } from '../interfaces';

export class SignInDto implements ISignInRequest {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
