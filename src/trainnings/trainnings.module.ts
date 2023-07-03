import { Module } from '@nestjs/common';
import { TrainningsController } from './controllers/trainnings/trainnings.controller';
import { TrainningsService } from './services/trainnings/trainnings.service';
import { CoachesModule } from '../coaches/coaches.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Box } from '../typeOrm/entities/Box';

@Module({
  imports: [TypeOrmModule.forFeature([Box]), CoachesModule],
  controllers: [TrainningsController],
  providers: [TrainningsService],
})
export class TrainningsModule {}
