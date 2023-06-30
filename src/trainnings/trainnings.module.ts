import { Module } from '@nestjs/common';
import { TrainningsController } from './controllers/trainnings/trainnings.controller';
import { TrainningsService } from './services/trainnings/trainnings.service';
import { CoachesModule } from '../coaches/coaches.module';

@Module({
  imports: [CoachesModule],
  controllers: [TrainningsController],
  providers: [TrainningsService],
})
export class TrainningsModule {}
