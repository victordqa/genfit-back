import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ExerciseForCalc,
  SuggestTrainningParams,
  TrainningExerciseData,
  TrainningForCalc,
} from '../../../utils/types';
import { Repository } from 'typeorm';
import { Box } from '../../../typeOrm/entities/Box';
import { Trainning } from '../../../typeOrm/entities/Trainning';
import { TrainningBlock } from '../../../typeOrm/entities/TrainningBlock';
import { ExercisesService } from '../../../exercises/services/exercises/exercises.service';
import { TrainningBlockExercise } from '../../../typeOrm/entities/TrainningBlockExercise';
import { Exercise } from '../../../typeOrm/entities/Exercise';

@Injectable()
export class TrainningsService {
  constructor(
    @InjectRepository(Box) private boxRepository: Repository<Box>,
    @InjectRepository(Trainning)
    private trainningRepository: Repository<Trainning>,
    @InjectRepository(TrainningBlockExercise)
    private trainningBlockExerciseRepository: Repository<TrainningBlockExercise>,
    @InjectRepository(TrainningBlock)
    private trainningBlockRepository: Repository<TrainningBlock>,
    private exercisesService: ExercisesService,
  ) {}
  async suggestTrainning(suggestTrainningParams: SuggestTrainningParams) {
    //get trainning history from db
    const history = await this.getTrainningHistory(
      suggestTrainningParams.boxId,
    );
    // parse trainning history
    const parsedHistory = this.dbTrainningToCalcTrainningParser(
      history.trainnings,
    );

    this.generateTrainning(
      suggestTrainningParams.quantity,
      parsedHistory,
      suggestTrainningParams.coachId,
    );
    return { msg: 'Hello!' };
  }

  private async generateTrainning(
    quantity: number,
    history: TrainningForCalc[],
    coachId: number,
  ) {
    const exercises = await this.exercisesService.listExercises(coachId);
    const parsedExercises = this.exerciseDbToExerciseForCalcParser(exercises);

    const lastTrainnings = history.slice(-2);
    const totalReps = this.computeTotalReps(lastTrainnings, parsedExercises);
  }

  private computeTotalReps(
    trainning: TrainningForCalc[],
    parsedExercises: ExerciseForCalc[],
  ) {
    return trainning.map((trainning) => {
      const blocks = ['warmUp', 'skill', 'wod'];
      const explicitReps = Object.assign({}, trainning);
      for (let blockName of blocks) {
        explicitReps[blockName] = this.computeBlockTotalReps(
          trainning[blockName],
          parsedExercises,
        );
      }
      console.dir(explicitReps, { depth: null });
      return explicitReps;
    });
  }

  private exerciseDbToExerciseForCalcParser(dbExercises: Exercise[]) {
    const parsedExs = dbExercises.map((dbEx) => {
      const musclesTargeted = dbEx.exercise_muscle_impact.map((emi) => ({
        name: emi.muscle.name,
        impact: emi.impact,
      }));

      const blocks = dbEx.blocks.map((b) => b.name);

      return {
        id: dbEx.id,
        name: dbEx.name,
        complexity: dbEx.complexity,
        musclesTargeted,
        timePerRepInS: dbEx.time_per_rep_s,
        blocks,
      };
    });
    return parsedExs;
  }

  private computeBlockTotalReps(
    block: TrainningExerciseData,
    exercises: ExerciseForCalc[],
  ) {
    const modifier = block.modifier;
    if (modifier === 'EMOM') {
      const numberOfRounds = Math.round(
        block.durationInM / block.exercises.length,
      );

      return {
        ...block,
        exercises: block.exercises.map((bex) => {
          return { ...bex, reps: bex.reps * numberOfRounds };
        }),
      };
    }

    if (modifier === 'AMRAP') {
      //compute block total duration
      const roundDuration = block.exercises.reduce((acc, ex) => {
        return (acc += exercises[ex.id].timePerRepInS * ex.reps);
      }, 0);
      const numberOfRounds = Math.round(
        (block.durationInM * 60) / roundDuration,
      );
      //multiply each rep by the number of rounds

      return {
        ...block,
        exercises: block.exercises.map((bex) => {
          return { ...bex, reps: bex.reps * numberOfRounds };
        }),
      };
    }

    if (modifier === 'TABATA') {
      const numberOfExercises = block.exercises.length;
      const totalTime = numberOfExercises > 2 ? 8 : 4;

      const numberOfRounds = Math.round((totalTime / numberOfExercises) * 2);

      return {
        ...block,
        exercises: block.exercises.map((bex) => {
          return { ...bex, reps: bex.reps * numberOfRounds };
        }),
      };
    }

    if (modifier === '40" on 20" off') {
      const numberOfExercises = block.exercises.length;
      const totalTime = block.durationInM;
      const numberOfRounds = totalTime / numberOfExercises;

      return {
        ...block,
        exercises: block.exercises.map((bex) => {
          return { ...bex, reps: bex.reps * numberOfRounds };
        }),
      };
    }

    if (modifier === 'n rounds FT') {
      const roundDuration = block.exercises.reduce((acc, ex) => {
        return (acc += exercises[ex.id].timePerRepInS * ex.reps);
      }, 0);
      const numberOfRounds = Math.round(
        (block.durationInM * 60) / roundDuration,
      );
      //multiply each rep by the number of rounds

      //chipper strength and techinique dont need to be computed as their reps already are their total reps

      return {
        ...block,
        exercises: block.exercises.map((bex) => {
          return { ...bex, reps: bex.reps * numberOfRounds };
        }),
      };
    }

    return block;
  }

  private dbTrainningToCalcTrainningParser(trainnings: Trainning[]) {
    //parse from db format to the format used in the service calculations so we can reutilize those functions
    const convertBlockName = (name: string) => {
      if (name === 'WOD') return 'wod';
      if (name === 'Skill') return 'skill';
      if (name === 'Warm Up') return 'warmUp';
    };
    return trainnings.map((trainning) => {
      let calcTrainning = {} as TrainningForCalc;
      trainning.trainningBlocks.forEach((trainningBlock) => {
        let blockName = convertBlockName(trainningBlock.block.name);
        let blockId = trainningBlock.id;
        let blockDuration = trainningBlock.duration_in_m;
        let blockModifierName = trainningBlock.modifier.name;
        let blockModifierId = trainningBlock.modifierId;

        let blockExercises = trainningBlock.trainningBlockExercises.map(
          (ex) => {
            let reps = ex.reps;
            let load = ex.load;
            let id = ex.exerciseId;
            return { reps, load, id };
          },
        );
        calcTrainning[blockName] = {
          durationInM: blockDuration,
          modifier: blockModifierName,
          modifierId: blockModifierId,
          blockId,
          exercises: blockExercises,
        };
        // now structure block info and add it to calcTrainning
        //add the info needed below, adapt type of calc funcs to accept them
      });
      return calcTrainning;
    });
  }

  async getTrainningHistory(boxId: number) {
    const trainnings = await this.boxRepository.findOne({
      where: { id: boxId },
      relations: {
        trainnings: {
          trainningBlocks: {
            trainningBlockExercises: {
              exercise: { exercise_muscle_impact: true },
            },
            block: true,
            modifier: true,
          },
        },
      },
    });
    // console.dir(trainnings, { depth: null });
    return trainnings;
  }

  async createTrainning() {
    const boxId = 1;
    const trainningParams = {
      warmUp: {
        exercises: [{ id: 11, name: 'Overhead Lunges', reps: 10, load: 0.5 }],
        modifier: '40" on 20" off',
        modifierId: 4,
        durationInM: 5,
        blockId: 1,
      },
      skill: {
        exercises: [
          { id: 1, name: 'Deadlift', reps: 28, load: 0.8 },
          { id: 54, name: 'Split Jerk', reps: 26, load: 0.8 },
        ],
        modifier: 'Strength',
        modifierId: 6,
        durationInM: 9,
        blockId: 2,
      },
      wod: {
        exercises: [
          { id: 28, name: 'Strict Ring Dip', reps: 31, load: 0.3 },
          { id: 3, name: 'Back Squat', reps: 39, load: 0.3 },
          { id: 48, name: 'Sit Up', reps: 32, load: 0.3 },
          { id: 1, name: 'Deadlift', reps: 30, load: 0.3 },
        ],
        modifier: 'Chipper',
        modifierId: 7,
        durationInM: 6,
        blockId: 3,
      },
    };
    const trainningInstance = this.trainningRepository.create({ boxId });
    await this.trainningRepository.save(trainningInstance);
    Object.entries(trainningParams).forEach(async ([_blockName, block]) => {
      let trainningBlockInstance = this.trainningBlockRepository.create({
        duration_in_m: block.durationInM,
        blockId: block.blockId,
        modifierId: block.modifierId,
      });
      trainningBlockInstance.trainning = trainningInstance;
      let trainningBlockDb = await this.trainningBlockRepository.save(
        trainningBlockInstance,
      );
      let exercisesInstances = block.exercises.map((exercise) => {
        return this.trainningBlockExerciseRepository.create({
          trainningBlockId: trainningBlockDb.id,
          exerciseId: exercise.id,
          reps: exercise.reps,
          load: exercise.load,
        });
      });
      await this.trainningBlockExerciseRepository.save(exercisesInstances);
    });
  }
}
