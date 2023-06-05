import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Exercise } from 'src/typeOrm/entities/Exercise';
import { Repository } from 'typeorm';
import { exercisesSeed, ExerciseSeed } from 'src/typeOrm/seeds/exercises';
import { Coach } from 'src/typeOrm/entities/Coach';

@Injectable()
export class ExercisesService {
  private exercisesSeed: { [index: number]: ExerciseSeed };
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
  ) {}
  seedExercises(coach: Coach) {
    const seeds = Object.entries(exercisesSeed).map(
      ([_exercId, exerciseData]) => {
        const { name, timePerRepInS, complexity } = exerciseData;
        const seed = this.exerciseRepository.create({
          name,
          complexity,
          time_per_rep_s: timePerRepInS,
          loadable: true,
          is_cardio_specific: false,
        });
        seed.coach = coach;

        return seed;
      },
    );
    // implement many to many relations to add extra exs info
    return seeds;
  }
}
