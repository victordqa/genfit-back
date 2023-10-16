import {
  MaxLength,
  MinLength,
  IsInt,
  Max,
  Min,
  IsPositive,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class SearchExerciseDto {
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  search: string;

  @IsOptional()
  @IsInt()
  @Max(15)
  @Min(5)
  take: number = 10;

  @IsOptional()
  @IsInt()
  @Min(0)
  skip: number = 0;
}
