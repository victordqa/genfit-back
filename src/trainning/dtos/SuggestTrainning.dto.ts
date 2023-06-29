import { Max, MaxLength, Min, MinLength } from 'class-validator';

export class SuggestTrainningDto {
  @Max(14)
  @Min(1)
  quantity: number;
}
