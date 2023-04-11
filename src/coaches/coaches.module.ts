import { Module } from '@nestjs/common';
import { CoachesController } from './controllers/coaches/coaches.controller';
import { CoachesService } from './services/coaches/coaches.service';

@Module({
  controllers: [CoachesController],
  providers: [CoachesService]
})
export class CoachesModule {}
