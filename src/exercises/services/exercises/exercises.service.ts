import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coach } from '../../../typeOrm/entities/Coach';
import { Exercise } from '../../../typeOrm/entities/Exercise';
import { ExerciseMuscleImpact } from '../../../typeOrm/entities/ExerciseMuscleImpact';
import { Muscle } from '../../../typeOrm/entities/Muscle';
import { ExerciseSeed, exercisesSeed } from '../../../typeOrm/seeds/exercises';
import { Block } from '../../../typeOrm/entities/Block';

@Injectable()
export class ExercisesService {
  private exercisesSeed: { [index: number]: ExerciseSeed } = exercisesSeed;
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    @InjectRepository(Block)
    private blockRepository: Repository<Block>,
    @InjectRepository(Muscle)
    private muscleRepository: Repository<Muscle>,
    @InjectRepository(ExerciseMuscleImpact)
    private exerciseMuscleImpact: Repository<ExerciseMuscleImpact>,
  ) {}
  async seedExercises(coach: Coach) {
    const dbMuscles = await this.muscleRepository.find();
    const blocks = await this.listBocks();
    const seeds = Object.entries(this.exercisesSeed).map(
      ([_exercId, exerciseData]) => {
        const { name, timePerRepInS, complexity, musclesTargeted } =
          exerciseData;

        let filteredBlocks = blocks.filter((b) =>
          exerciseData.blocks.includes(b.name),
        );

        const exerciseSeed = this.exerciseRepository.create({
          name,
          complexity,
          time_per_rep_s: timePerRepInS,
          loadable: true,
          is_cardio_specific: false,
          blocks: filteredBlocks,
        });
        exerciseSeed.coach = coach;

        const musclesTargetWithIds = musclesTargeted.map((muscle) => {
          const [dbMuscle] = dbMuscles.filter(
            (dbMuscle) => dbMuscle.name === muscle.name,
          );
          return {
            muscleId: dbMuscle.id,
            name: dbMuscle.name,
            impact: muscle.impact,
            exName: name,
          };
        });

        return {
          exerciseSeed,
          musclesTargetWithIds,
        };
      },
    );
    return seeds;
  }

  seedExerciseMuscleImpact(
    muscleImpacts: {
      muscleId: number;
      name: string;
      impact: number;
      exName: string;
    }[][],
    savedExercises: Exercise[],
  ) {
    const exerciseMuscleImpacts = muscleImpacts.map((impacts) => {
      const exName = impacts[0].exName;

      const exId = savedExercises
        .filter((ex) => ex.name === exName)
        .map((ex) => ex.id)[0];

      const exerciseMuscleImpact = impacts.map((impact) => ({
        exerciseId: exId,
        muscleId: impact.muscleId,
        impact: impact.impact,
      }));

      return exerciseMuscleImpact;
    });
    return exerciseMuscleImpacts
      .flat()
      .map((ex) => this.exerciseMuscleImpact.create(ex));
  }

  async listBocks() {
    return await this.blockRepository.find();
  }
}
