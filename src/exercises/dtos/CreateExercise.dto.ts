import { MaxLength, MinLength, IsInt, Max, Min } from 'class-validator';

export class CreateExerciseDto {
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @IsInt()
  @Max(5)
  @Min(1)
  complexity: number;
}
