import {
  Controller,
  Get,
  UseGuards,
  Query,
  ValidationPipe,
  UsePipes,
  Post,
  Body,
} from '@nestjs/common';
import { TrainningsService } from '../../services/trainnings/trainnings.service';
import { JwtAuthGuard } from '../../../auth/utils/JwtAuthGuard';
import { User } from '../../../coaches/controllers/coaches/decorators/user.decorator';
import { SingleTrainningDetails, UserPayload } from '../../../utils/types';
import { SuggestTrainningDto } from '../../dtos/SuggestTrainning.dto';

import { CreateTrainningDto } from '../../dtos/CreateTrainning.dto';
import { IsBoxOwnerGuard } from '../../guards/is-box-owner/is-box-owner.guard';
import { CalcRecentTrainningLoad } from '../../dtos/CalcRecentTrainningLoad.dto';

@Controller('trainnings')
export class TrainningsController {
  constructor(private trainningsService: TrainningsService) {}

  @UseGuards(JwtAuthGuard, IsBoxOwnerGuard)
  @Get('suggest')
  async suggestTrainning(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: SuggestTrainningDto,
    @User() userPayload: UserPayload,
  ) {
    const suggestion = await this.trainningsService.suggestTrainning({
      boxId: query.boxId,
      quantity: query.quantity,
      coachId: userPayload.sub,
    });

    return suggestion;
  }

  @UseGuards(JwtAuthGuard, IsBoxOwnerGuard)
  @Get('calc-recent-load')
  async calcRecentTrainningLoad(
    @Query(
      new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        forbidNonWhitelisted: true,
      }),
    )
    query: CalcRecentTrainningLoad,
    @User() userPayload: UserPayload,
  ) {
    const recentLoad = await this.trainningsService.calcRecentTrainningLoad({
      boxId: query.boxId,
      coachId: userPayload.sub,
    });

    //also get recommended load

    return recentLoad;
  }

  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, IsBoxOwnerGuard)
  @Post('create')
  async createTrainning(@Body() createTrainningDto: CreateTrainningDto) {
    const { boxId, trainnings } = createTrainningDto;
    const createdTrainnings = await this.trainningsService.createTrainning({
      boxId,
      trainnings,
    });

    return { createdTrainnings };
  }
}
