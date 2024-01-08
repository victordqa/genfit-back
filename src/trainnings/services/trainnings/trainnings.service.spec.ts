import { Test, TestingModule } from '@nestjs/testing';
import { TrainningsService } from './trainnings.service';
import { DataSource, Repository } from 'typeorm';
import { ExercisesService } from '../../../exercises/services/exercises/exercises.service';
import { Box } from '../../../typeOrm/entities/Box';
import { Trainning } from '../../../typeOrm/entities/Trainning';
import { TrainningBlock } from '../../../typeOrm/entities/TrainningBlock';
import { TrainningBlockExercise } from '../../../typeOrm/entities/TrainningBlockExercise';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { Exercise } from '../../../typeOrm/entities/Exercise';
import { Block } from '../../../typeOrm/entities/Block';
import { Muscle } from '../../../typeOrm/entities/Muscle';
import { ExerciseMuscleImpact } from '../../../typeOrm/entities/ExerciseMuscleImpact';
import { Modifier } from '../../../typeOrm/entities/Modifier';

describe('TrainningsService', () => {
  let service: TrainningsService;
  let boxRepository: Repository<Box>;
  let trainningRepository: Repository<Trainning>;
  let trainningBlockExerciseRepository: Repository<TrainningBlockExercise>;
  let muscleRepository: Repository<Muscle>;
  let trainningBlockRepository: Repository<TrainningBlock>;
  let blockRepository: Repository<Block>;
  let exerciseRepository: Repository<Exercise>;
  let exercisesService: ExercisesService;
  let dataSource: DataSource;
  let exerciseMuscleImpactRepository: Repository<ExerciseMuscleImpact>;
  let modifierRepository: Repository<Modifier>;

  const BOX_TOKEN = getRepositoryToken(Box);
  const TRAINNING_REPOSITORY_TOKEN = getRepositoryToken(Trainning);
  const TRAINNING_BLOCK_EXERCISE_REPOSITORY_TOKEN = getRepositoryToken(
    TrainningBlockExercise,
  );
  const TRAINNING_BLOCK_REPOSITORY_TOKEN = getRepositoryToken(TrainningBlock);
  const EXERCISE_REPOSITORY_TOKEN = getRepositoryToken(Exercise);
  const BLOCK_REPOSITORY_TOKEN = getRepositoryToken(Block);
  const MUSCLE_REPOSITORY_TOKEN = getRepositoryToken(Muscle);
  const MODIFIER_REPOSITORY_TOKEN = getRepositoryToken(Modifier);
  const EXERCISE_MUSCLE_IMPACT_REPOSITORY_TOKEN =
    getRepositoryToken(ExerciseMuscleImpact);
  const DATA_SOURCE_TOKEN = getDataSourceToken();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrainningsService,
        {
          provide: BOX_TOKEN,
          useValue: {},
        },
        {
          provide: MODIFIER_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: EXERCISE_MUSCLE_IMPACT_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: MUSCLE_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: BLOCK_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: TRAINNING_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: TRAINNING_BLOCK_EXERCISE_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: TRAINNING_BLOCK_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: EXERCISE_REPOSITORY_TOKEN,
          useValue: {},
        },
        {
          provide: DATA_SOURCE_TOKEN,
          useValue: {},
        },
        ExercisesService,
      ],
    }).compile();

    service = module.get<TrainningsService>(TrainningsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
