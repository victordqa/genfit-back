import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from '../typeOrm/entities/Exercise';
import { ExerciseMuscleImpact } from '../typeOrm/entities/ExerciseMuscleImpact';
import { Muscle } from '../typeOrm/entities/Muscle';
import { ExercisesController } from './controllers/exercises/exercises.controller';
import { ExercisesService } from './services/exercises/exercises.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise, ExerciseMuscleImpact, Muscle])],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
