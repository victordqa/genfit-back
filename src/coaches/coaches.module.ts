import { Module } from '@nestjs/common';
import { CoachesController } from './controllers/coaches/coaches.controller';
import { CoachesService } from './services/coaches/coaches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coach } from 'src/typeOrm/entities/Coach';

@Module({
  imports: [TypeOrmModule.forFeature([Coach])],
  controllers: [CoachesController],
  providers: [CoachesService],
})
export class CoachesModule {}
