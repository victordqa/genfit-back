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
import { UserPayload } from '../../../utils/types';
import { SuggestTrainningDto } from '../../../trainning/dtos/SuggestTrainning.dto';
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
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createTrainning(
    @Body() createTrainningDto: CreateTrainningDto,
    @User() userPayload: UserPayload,
  ) {
    // const createdTrainning = await this.trainningsService.createTrainning({
    //   name: createBoxDto.name,
    //   coachId: userPayload.sub,
    // });
    this.trainningsService.createTrainning();
    return { msg: 'ok' };
  }
}
