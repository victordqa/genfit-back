import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateCoachDto {
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  @MaxLength(15)
  password: string;

  @MinLength(6)
  @MaxLength(15)
  confirmPassword: string;
}
