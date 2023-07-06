import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuggestTrainningParams } from '../../../utils/types';
import { Repository } from 'typeorm';
import { Box } from '../../../typeOrm/entities/Box';
import { Trainning } from '../../../typeOrm/entities/Trainning';
import { TrainningBlock } from '../../../typeOrm/entities/TrainningBlock';
import { ExercisesService } from '../../../exercises/services/exercises/exercises.service';
import { TrainningBlockExercise } from '../../../typeOrm/entities/TrainningBlockExercise';

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
  ) {}
  async suggestTrainning(suggestTrainningParams: SuggestTrainningParams) {
    //get trainning history from db
    const history = this.getTrainningHistory(suggestTrainningParams.boxId);
    // const history = this.trainningRepository
    // start recursive function with quantity of trainnings and history
    return { msg: 'Hello!' };
  }

  async getTrainningHistory(boxId: number) {
    const trainnings = await this.boxRepository.find({
      where: { id: boxId },
      relations: {
        trainnings: {
          trainningBlocks: {
            trainningBlockExercises: {
              exercise: { exercise_muscle_impact: true },
            },
            block: true,
          },
        },
      },
    });
    console.dir(trainnings, { depth: null });
    return trainnings;
  }

  async createTrainning() {
    const boxId = 1;
    const trainningParams = {
      warmUp: {
        exercises: [{ id: 11, name: 'Overhead Lunges', reps: 10, load: 0.5 }],
        modifier: { name: '40" on 20" off', id: 1 },
        durationInM: 5,
        blockId: 1,
      },
      skill: {
        exercises: [
          { id: 1, name: 'Deadlift', reps: 28, load: 0.8 },
          { id: 54, name: 'Split Jerk', reps: 26, load: 0.8 },
        ],
        modifier: 'Strength',
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
