import { Module } from '@nestjs/common';
import { ExercisesController } from './controllers/exercises/exercises.controller';
import { ExercisesService } from './services/exercises/exercises.service';
import { Exercise } from 'src/typeOrm/entities/Exercise';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExerciseMuscleImpact } from 'src/typeOrm/entities/ExerciseMuscleImpact';
import { Muscle } from 'src/typeOrm/entities/Muscle';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise, ExerciseMuscleImpact, Muscle])],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
