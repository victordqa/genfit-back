import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisesModule } from '../exercises/exercises.module';
import { Box } from '../typeOrm/entities/Box';
import { Coach } from '../typeOrm/entities/Coach';
import { CoachesController } from './controllers/coaches/coaches.controller';
import { CoachesService } from './services/coaches/coaches.service';

@Module({
  imports: [TypeOrmModule.forFeature([Coach, Box]), ExercisesModule],
  controllers: [CoachesController],
  providers: [CoachesService],
  exports: [CoachesService],
})
export class CoachesModule {}
