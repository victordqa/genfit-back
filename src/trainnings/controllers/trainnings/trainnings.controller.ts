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
import { IsBoxOwnerGuard } from '../../../trainning/guards/is-box-owner/is-box-owner.guard';
import { CreateTrainningDto } from '../../dtos/CreateTrainning.dto';

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
