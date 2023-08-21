import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExercisesService } from '../../../../src/exercises/services/exercises/exercises.service';
import { Box } from '../../../../src/typeOrm/entities/Box';
import { Coach } from '../../../../src/typeOrm/entities/Coach';
import { hashPassword } from '../../../../src/utils/hashing';
import {
  CreateBoxParams,
  CreateCoachParams,
} from '../../../../src/utils/types';
import { Exercise } from '../../../../src/typeOrm/entities/Exercise';
import { ExerciseMuscleImpact } from '../../../../src/typeOrm/entities/ExerciseMuscleImpact';

@Injectable()
export class CoachesFixtureService {
  constructor(
    @InjectRepository(Coach) private coachRepository: Repository<Coach>,
    @InjectRepository(Box) private boxRepository: Repository<Box>,
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    @InjectRepository(ExerciseMuscleImpact)
    private exerciseMuscleImpactRepository: Repository<ExerciseMuscleImpact>,
    private exercisesService: ExercisesService,
  ) {}

  async createCoach(coachDetails: CreateCoachParams) {
    const { password, email, name } = coachDetails;

    const hashedPassword = await hashPassword(password);
    const newCoach = this.coachRepository.create({
      email,
      name,
      password: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedCoach = await this.coachRepository.save(newCoach);

    const exerciseMuscleSeeds = await this.exercisesService.seedExercises(
      newCoach,
    );

    const exerciseSeeds = exerciseMuscleSeeds.map(
      (seeds) => seeds.exerciseSeed,
    );

    const savedExercises = await this.exerciseRepository.save(exerciseSeeds);
    const muscleImpacts = exerciseMuscleSeeds.map(
      (seed) => seed.musclesTargetWithIds,
    );

    const exerciseMuscleImpactsInstances =
      this.exercisesService.seedExerciseMuscleImpact(
        muscleImpacts,
        savedExercises,
      );

    await this.exerciseMuscleImpactRepository.save(
      exerciseMuscleImpactsInstances,
    );

    return savedCoach;
  }

  async createBox(boxDetails: CreateBoxParams) {
    const { coachId } = boxDetails;
    const coach = await this.coachRepository.findOneBy({ id: coachId });

    const newBox = this.boxRepository.create({
      ...boxDetails,
      coach,
    });

    return this.boxRepository.save(newBox);
  }
}
