import { Module } from '@nestjs/common';
import { TrainningsController } from './controllers/trainnings/trainnings.controller';
import { TrainningsService } from './services/trainnings/trainnings.service';
import { CoachesModule } from '../coaches/coaches.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Box } from '../typeOrm/entities/Box';
import { Trainning } from '../typeOrm/entities/Trainning';
import { TrainningBlock } from '../typeOrm/entities/TrainningBlock';
import { TrainningBlockExercise } from '../typeOrm/entities/TrainningBlockExercise';
import { ExercisesModule } from '../exercises/exercises.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Box,
      Trainning,
      TrainningBlock,
      TrainningBlockExercise,
    ]),
    CoachesModule,
    ExercisesModule,
  ],
  controllers: [TrainningsController],
  providers: [TrainningsService],
})
export class TrainningsModule {}
