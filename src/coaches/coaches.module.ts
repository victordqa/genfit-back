import { Module } from '@nestjs/common';
import { CoachesController } from './controllers/coaches/coaches.controller';
import { CoachesService } from './services/coaches/coaches.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coach } from 'src/typeOrm/entities/Coach';
import { Box } from 'src/typeOrm/entities/Box';

@Module({
  imports: [TypeOrmModule.forFeature([Coach, Box])],
  controllers: [CoachesController],
  providers: [CoachesService],
})
export class CoachesModule {}
