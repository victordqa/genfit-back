import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Coach } from '../../../typeOrm/entities/Coach';
import { Exercise } from '../../../typeOrm/entities/Exercise';
import { ExerciseMuscleImpact } from '../../../typeOrm/entities/ExerciseMuscleImpact';
import { Muscle } from '../../../typeOrm/entities/Muscle';
import { ExerciseSeed, exercisesSeed } from '../../../typeOrm/seeds/exercises';
import { Block } from '../../../typeOrm/entities/Block';
import { Modifier } from '../../../typeOrm/entities/Modifier';
import { SearchExerciseParams } from '../../../utils/types';

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
    @InjectRepository(Modifier)
    private modifierRepository: Repository<Modifier>,
  ) {}
  async seedExercises(coach: Coach) {
    const dbMuscles = await this.muscleRepository.find();
    const blocks = await this.listBlocks();
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

  async listBlocks() {
    return await this.blockRepository.find();
  }
  async listBlocksAndPreloads() {
    return await this.blockRepository.find({ relations: { modifiers: true } });
  }

  async listMuscleRefs() {
    return await this.muscleRepository.find();
  }

  async listModifiers() {
    return await this.modifierRepository.find();
  }

  async listExercisesAndPreloads(coachId: number) {
    return await this.exerciseRepository.find({
      where: { coachId },
      relations: { exercise_muscle_impact: { muscle: true }, blocks: true },
    });
  }

  async listExercises(coachId: number) {
    return await this.exerciseRepository.find({
      where: { coachId },
    });
  }

  async listExercisesFiltered(
    searchParams: SearchExerciseParams,
    coachId: number,
  ) {
    const take = searchParams.take;
    const skip = searchParams.skip;
    const search = searchParams.search || '';

    const [result, total] = await this.exerciseRepository.findAndCount({
      where: { name: ILike('%' + search + '%'), coachId },
      order: { name: 'DESC' },
      take: take,
      skip: skip,
    });

    return {
      data: result,
      count: total,
    };
  }
}
