import { Module } from '@nestjs/common';
import { TrainningsController } from './controllers/trainnings/trainnings.controller';
import { TrainningsService } from './services/trainnings/trainnings.service';

@Module({
  controllers: [TrainningsController],
  providers: [TrainningsService]
})
export class TrainningsModule {}
