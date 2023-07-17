import { Type } from 'class-transformer';
import {
  Max,
  MaxLength,
  Min,
  MinLength,
  IsNumber,
  max,
  ValidateNested,
  IsNotEmpty,
  maxLength,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';

class ExerciseDto {
  @Min(1)
  @IsNumber()
  id: number;

  @MaxLength(200)
  name: string;

  @Min(1)
  @IsNumber()
  reps: number;

  @Min(0)
  @Max(5)
  @IsNumber()
  load: number;
}

class BlockDto {
  @Type(() => ExerciseDto)
  @ValidateNested()
  exercises: ExerciseDto[];

  @MaxLength(200)
  modifier: string;

  @Min(0)
  @IsNumber()
  durationInM: number;

  @Min(1)
  @IsNumber()
  blockId: number;

  @Min(1)
  @IsNumber()
  modifierId: number;
}

class TrainningWithBlockIdsDto {
  @Type(() => BlockDto)
  @ValidateNested()
  warmUp: BlockDto;

  @Type(() => BlockDto)
  @ValidateNested()
  skill: BlockDto;

  @Type(() => BlockDto)
  @ValidateNested()
  wod: BlockDto;
}

class SingleTrainningDto {
  @Type(() => TrainningWithBlockIdsDto)
  @ValidateNested()
  @IsNotEmpty()
  trainningWithBlockIds: TrainningWithBlockIdsDto;
}

export class CreateTrainningDto {
  @Type(() => SingleTrainningDto)
  @ValidateNested()
  @IsNotEmpty()
  @ArrayMaxSize(14)
  @ArrayMinSize(1)
  trainnings: SingleTrainningDto[];

  @Min(1)
  @IsNumber()
  boxId: number;
}
