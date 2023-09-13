import { Max, MaxLength, Min, MinLength, IsNumber } from 'class-validator';

export class CalcRecentTrainningLoad {
  @Min(1)
  @IsNumber()
  boxId: number;
}
