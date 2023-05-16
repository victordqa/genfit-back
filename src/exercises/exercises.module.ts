import { Module } from '@nestjs/common';
import { ExercisesController } from './controllers/exercises/exercises.controller';
import { ExercisesService } from './services/exercises/exercises.service';

@Module({
  controllers: [ExercisesController],
  providers: [ExercisesService]
})
export class ExerciseModule {}
