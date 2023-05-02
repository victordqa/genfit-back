import { MaxLength, MinLength } from 'class-validator';

export class CreateBoxDto {
  @MinLength(1)
  @MaxLength(255)
  name: string;
}
