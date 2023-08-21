import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesModule } from '../../../../src/exercises/exercises.module';
import { Box } from '../../../../src/typeOrm/entities/Box';
import { Coach } from '../../../../src/typeOrm/entities/Coach';
import { CoachesController } from '../../../../src/coaches/controllers/coaches/coaches.controller';
import { CoachesService } from '../../../../src/coaches/services/coaches/coaches.service';
import { CoachesFixtureService } from './coachesFixture.service';

@Module({
  imports: [TypeOrmModule.forFeature([Coach, Box]), ExercisesModule],
  providers: [CoachesFixtureService],
  exports: [CoachesFixtureService],
})
export class CoachesFixtureModule {}
