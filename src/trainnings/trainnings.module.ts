import { Module } from '@nestjs/common';
import { TrainningsController } from './controllers/trainnings/trainnings.controller';
import { TrainningsService } from './services/trainnings/trainnings.service';
import { CoachesModule } from '../coaches/coaches.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Box } from '../typeOrm/entities/Box';
import { Trainning } from '../typeOrm/entities/Trainning';

@Module({
  imports: [TypeOrmModule.forFeature([Box, Trainning]), CoachesModule],
  controllers: [TrainningsController],
  providers: [TrainningsService],
})
export class TrainningsModule {}
