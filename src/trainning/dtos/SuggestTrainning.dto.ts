import { Max, MaxLength, Min, MinLength, IsNumber } from 'class-validator';

export class SuggestTrainningDto {
  @Max(500)
  @Min(1)
  @IsNumber()
  quantity: number;

  @Min(1)
  @IsNumber()
  boxId: number;
}
