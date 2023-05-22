import {
  MaxLength,
  MinLength,
  IsInt,
  Max,
  Min,
  IsPositive,
  IsBoolean,
} from 'class-validator';

export class CreateExerciseDto {
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsInt()
  @Max(5)
  @Min(1)
  complexity: number;

  @IsPositive()
  time_per_rep_s: number;

  @IsBoolean()
  loadable: boolean;

  @IsBoolean()
  is_cardio_specific: boolean;
}
