import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exercise } from 'src/typeOrm/entities/Exercise';
import { Repository } from 'typeorm';
import { exercisesSeed, ExerciseSeed } from 'src/typeOrm/seeds/exercises';
import { Coach } from 'src/typeOrm/entities/Coach';
import { Muscle } from 'src/typeOrm/entities/Muscle';
import { ExerciseMuscleImpact } from 'src/typeOrm/entities/ExerciseMuscleImpact';

@Injectable()
export class ExercisesService {
  private exercisesSeed: { [index: number]: ExerciseSeed } = exercisesSeed;
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    @InjectRepository(Muscle)
    private muscleRepository: Repository<Muscle>,
    @InjectRepository(ExerciseMuscleImpact)
    private exerciseMuscleImpact: Repository<ExerciseMuscleImpact>,
  ) {}
  async seedExercises(coach: Coach) {
    const dbMuscles = await this.muscleRepository.find();
    const seeds = Object.entries(this.exercisesSeed).map(
      ([_exercId, exerciseData]) => {
        const { name, timePerRepInS, complexity, musclesTargeted } =
          exerciseData;
        const exerciseSeed = this.exerciseRepository.create({
          name,
          complexity,
          time_per_rep_s: timePerRepInS,
          loadable: true,
          is_cardio_specific: false,
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

        // get muscles
        //get muscle id and impact  based on exercise exerciseSeed
        // craete item on bridge table inserting
        return { exerciseSeed, musclesTargetWithIds };
      },
    );
    // implement many to many relations to add extra exs info
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
}
