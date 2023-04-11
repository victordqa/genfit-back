import { Controller, Get, Post } from '@nestjs/common';

@Controller('coaches')
export class CoachesController {
  @Get()
  getCoaches() {}

  @Post()
  createCoach() {}
}
