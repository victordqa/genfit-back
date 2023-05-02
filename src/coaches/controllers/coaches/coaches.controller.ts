import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/utils/JwtAuthGuard';
import { CreateBoxDto } from 'src/coaches/dtos/CreateBox.dto';
import { CreateCoachDto } from 'src/coaches/dtos/CreateCoach.dto';
import { CoachesService } from 'src/coaches/services/coaches/coaches.service';
import { UserPayload } from 'src/utils/types';
import { User } from './decorators/user.decorator';

@Controller('coaches')
export class CoachesController {
  constructor(private coachesService: CoachesService) {}

  @Post('create')
  @UsePipes(ValidationPipe)
  async createCoach(@Body() createCoachDto: CreateCoachDto) {
    const createdCoach = await this.coachesService.createCoach(createCoachDto);
    return { id: createdCoach.id };
  }

  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @Post('create-box')
  async createBox(
    @Body() createBoxDto: CreateBoxDto,
    @User() userPayload: UserPayload,
  ) {
    console.log(userPayload);
    const createdBox = await this.coachesService.createBox({
      name: createBoxDto.name,
      coachId: userPayload.sub,
    });
    return { id: createdBox.id };
  }
}
