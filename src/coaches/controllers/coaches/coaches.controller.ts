import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateBoxDto } from 'src/coaches/dtos/CreateBox.dto';
import { CreateCoachDto } from 'src/coaches/dtos/CreateCoach.dto';
import { CoachesService } from 'src/coaches/services/coaches/coaches.service';

@Controller('coaches')
export class CoachesController {
  constructor(private coachesService: CoachesService) {}
  @Get()
  findCoaches() {}

  @Post('create')
  async createCoach(@Body() createCoachDto: CreateCoachDto) {
    const createdCoach = await this.coachesService.createCoach(createCoachDto);
    return { id: createdCoach.id };
  }
  @Post('create-box')
  async createBox(@Body() createBoxDto: CreateBoxDto) {
    const createdBox = await this.coachesService.createBox(createBoxDto);
    return { id: createdBox.id };
  }
}
