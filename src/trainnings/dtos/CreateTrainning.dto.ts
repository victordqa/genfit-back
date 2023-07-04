import { MaxLength, MinLength } from 'class-validator';

export class CreateTrainningDto {
  @MinLength(1)
  @MaxLength(255)
  name: string;
}
