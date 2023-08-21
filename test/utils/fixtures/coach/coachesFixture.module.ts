import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesModule } from '../../../../src/exercises/exercises.module';
import { Box } from '../../../../src/typeOrm/entities/Box';
import { Coach } from '../../../../src/typeOrm/entities/Coach';
import { CoachesFixtureService } from './coachesFixture.service';
import { Exercise } from '../../../../src/typeOrm/entities/Exercise';
import { ExerciseMuscleImpact } from '../../../../src/typeOrm/entities/ExerciseMuscleImpact';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coach, Box, Exercise, ExerciseMuscleImpact]),
    ExercisesModule,
  ],
  providers: [CoachesFixtureService],
  exports: [CoachesFixtureService],
})
export class CoachesFixtureModule {}
