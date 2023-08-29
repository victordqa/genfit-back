import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/utils/JwtAuthGuard';
import { CoachesService } from '../../services/coaches/coaches.service';
import { UserPayload } from '../../../utils/types';
import { CreateBoxDto } from '../../dtos/CreateBox.dto';
import { CreateCoachDto } from '../../dtos/CreateCoach.dto';
import { User } from './decorators/user.decorator';
import { IsBoxOwnerGuard } from '../../../trainnings/guards/is-box-owner/is-box-owner.guard';

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
    const createdBox = await this.coachesService.createBox({
      name: createBoxDto.name,
      coachId: userPayload.sub,
    });
    return { id: createdBox.id };
  }

  @UseGuards(JwtAuthGuard)
  @Get('boxes')
  async listBoxes(@User() userPayload: UserPayload) {
    const boxes = await this.coachesService.listCoachBoxes(userPayload.sub);
    return { boxes };
  }

  @UseGuards(JwtAuthGuard, IsBoxOwnerGuard)
  @Get('box/:boxId')
  async getBox(@Param('boxId', new ParseIntPipe()) boxId: number) {
    const box = await this.coachesService.listCoachBoxes(boxId);
    return { box };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findCoachById(@User() userPayload: UserPayload) {
    const coach = await this.coachesService.findCoachById(userPayload.sub);
    return { coach };
  }
}
