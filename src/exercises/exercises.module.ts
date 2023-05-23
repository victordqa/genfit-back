import { Module } from '@nestjs/common';
import { ExercisesController } from './controllers/exercises/exercises.controller';
import { ExercisesService } from './services/exercises/exercises.service';
import { Exercise } from 'src/typeOrm/entities/Exercise';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Exercise])],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}
